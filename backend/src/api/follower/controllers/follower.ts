import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::follower.follower",
  ({ strapi }) => ({
    async filters(cxt) {
      const knex = strapi.db.connection;

      const [
        countries,
        countryCodes,
        genders,
        languages,
        languageCodes,
        types,
      ] = await Promise.all([
        knex("followers")
          .select("country as value")
          .count("* as count")
          .whereNotNull("country")
          .where("country", "!=", "")
          .groupBy("country")
          .orderBy("count", "desc"),

        knex("followers")
          .select("country_code as value")
          .count("* as count")
          .whereNotNull("country_code")
          .where("country_code", "!=", "")
          .groupBy("country_code")
          .orderBy("count", "desc"),

        knex("followers")
          .select("gender as value")
          .count("* as count")
          .whereNotNull("gender")
          .where("gender", "!=", "")
          .groupBy("gender")
          .orderBy("count", "desc"),

        knex("followers")
          .select("language as value")
          .count("* as count")
          .whereNotNull("language")
          .where("language", "!=", "")
          .groupBy("language")
          .orderBy("count", "desc"),

        knex("followers")
          .select("language_code as value")
          .count("* as count")
          .whereNotNull("language_code")
          .where("language_code", "!=", "")
          .groupBy("language_code")
          .orderBy("count", "desc"),

        knex("followers")
          .select("type as value")
          .count("* as count")
          .whereNotNull("type")
          .where("type", "!=", "")
          .groupBy("type")
          .orderBy("count", "desc"),
      ]);

      return {
        countries,
        countryCodes,
        genders,
        languages,
        languageCodes,
        types,
      };
    },
    async browse(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      // Extract custom query params
      const scope = ctx.query.scope as string | undefined;
      const hasRecordings = ctx.query.hasRecordings === "true";
      const sort = ctx.query.sort as string | undefined;

      delete ctx.query.scope;
      delete ctx.query.hasRecordings;

      // Check if sorting by totalRecordings
      const sortByRecordings = sort?.includes("totalRecordings");
      const sortDirection = sort?.includes(":desc") ? "desc" : "asc";

      if (sortByRecordings) {
        delete ctx.query.sort;
      }

      // Extract and remove recordings populate config
      const recordingsPopulate = (ctx.query.populate as any)?.recordings;
      if (recordingsPopulate) {
        delete (ctx.query.populate as any).recordings;
      }

      // Get user's following list
      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: { followers: { fields: ["id"] } },
        });

      const followingIds = fullUser?.followers?.map((f) => f.id) || [];

      // If scope is "following" and user follows no one, return empty result
      if (scope === "following" && followingIds.length === 0) {
        return {
          data: [],
          meta: {
            pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 },
          },
        };
      }

      const knex = strapi.db.connection;
      const filters = ctx.query.filters as any;
      const page = parseInt(ctx.query["pagination[page]"] as string) || 1;
      const pageSize =
        parseInt(ctx.query["pagination[pageSize]"] as string) || 25;
      const offset = (page - 1) * pageSize;

      const escapeLikePattern = (value: string): string => {
        return value
          .replace(/\\/g, "\\\\") // Escape backslashes first
          .replace(/%/g, "\\%") // Escape %
          .replace(/_/g, "\\_"); // Escape _
      };

      // Helper function to apply common filters to a knex query
      const applyFilters = (query: any) => {
        // Scope filter
        if (scope === "following" && followingIds.length > 0) {
          query = query.whereIn("f.id", followingIds);
        } else if (scope === "discover" && followingIds.length > 0) {
          query = query.whereNotIn("f.id", followingIds);
        }

        // hasRecordings filter
        if (hasRecordings) {
          query = query.whereExists(function (builder) {
            builder
              .select(knex.raw("1"))
              .from("recordings_follower_lnk as rf_sub")
              .innerJoin(
                "recordings as r_sub",
                "rf_sub.recording_id",
                "r_sub.id"
              )
              .innerJoin(
                "recordings_sources_lnk as rs_sub",
                "rs_sub.recording_id",
                "r_sub.id"
              )
              .innerJoin("sources as s_sub", "rs_sub.source_id", "s_sub.id")
              .whereRaw("rf_sub.follower_id = f.id")
              .where("s_sub.state", "!=", "failed");
          });
        }

        // Other filters
        if (filters) {
          if (filters.country?.$eq) {
            query = query.where("f.country", filters.country.$eq);
          }
          if (filters.language?.$eq) {
            query = query.where("f.language", filters.language.$eq);
          }
          if (filters.gender?.$eq) {
            query = query.where("f.gender", filters.gender.$eq);
          }
          if (filters.type?.$eq) {
            query = query.where("f.type", filters.type.$eq);
          }
          if (filters.username?.$containsi) {
            const escapedUsername = escapeLikePattern(
              filters.username.$containsi
            );
            query = query.whereILike("f.username", `%${escapedUsername}%`);
          }
        }

        return query;
      };

      // If sorting by totalRecordings, use Knex for everything
      if (sortByRecordings) {
        // Build query with sorting by valid recording count using derived table
        let sortQuery = knex("followers as f")
          .select("f.id")
          .leftJoin(
            knex("recordings_follower_lnk as rf_inner")
              .select("rf_inner.follower_id", "rf_inner.recording_id")
              .innerJoin("recordings as r", "rf_inner.recording_id", "r.id")
              .innerJoin(
                "recordings_sources_lnk as rs",
                "rs.recording_id",
                "r.id"
              )
              .innerJoin("sources as s", "rs.source_id", "s.id")
              .where("s.state", "!=", "failed")
              .groupBy("rf_inner.follower_id", "rf_inner.recording_id")
              .as("rf"),
            "rf.follower_id",
            "f.id"
          )
          .groupBy("f.id")
          .orderByRaw(
            `COUNT(rf.recording_id) ${sortDirection === "desc" ? "desc" : "asc"}, f.id ASC`
          )
          .limit(pageSize)
          .offset(offset);

        // Build count query
        let countQuery = knex("followers as f").count("* as count");

        // Apply all filters to both queries
        sortQuery = applyFilters(sortQuery);
        countQuery = applyFilters(countQuery);

        // Execute queries
        const sortedIds = await sortQuery.pluck("f.id");
        const [{ count: total }] = await countQuery;

        if (sortedIds.length === 0) {
          return {
            data: [],
            meta: {
              pagination: { page, pageSize, pageCount: 0, total: 0 },
            },
          };
        }

        // Fetch full follower data using Strapi
        const followers = await strapi
          .documents("api::follower.follower")
          .findMany({
            filters: { id: { $in: sortedIds } },
            populate: ctx.query.populate,
          });

        // Re-sort to match the order from SQL query
        const sortedFollowers = sortedIds
          .map((id) => followers.find((f) => f.id === id))
          .filter(Boolean);

        // Add metadata
        const dataWithMeta = await Promise.all(
          sortedFollowers.map(async (follower) => {
            const recordingsQuery: any = {
              filters: { follower: { id: { $eq: follower.id } } },
              limit: 5,
              sort: { createdAt: "desc" },
            };

            if (recordingsPopulate?.populate) {
              recordingsQuery.populate = recordingsPopulate.populate;
            }

            const [totalRecordings, recordings] = await Promise.all([
              strapi.documents("api::recording.recording").count({
                ...recordingsQuery,
                limit: undefined,
              }),
              recordingsPopulate
                ? strapi
                    .documents("api::recording.recording")
                    .findMany(recordingsQuery)
                : Promise.resolve(undefined),
            ]);

            return {
              ...follower,
              ...(recordings !== undefined && {
                recordings: recordings.filter((r) => r.sources?.length > 0),
              }),
              isFollowing: followingIds.includes(follower.id),
              totalRecordings,
            };
          })
        );

        return {
          data: dataWithMeta,
          meta: {
            pagination: {
              page,
              pageSize,
              pageCount: Math.ceil(Number(total) / pageSize),
              total: Number(total),
            },
          },
        };
      }

      // ---- DEFAULT SORTING (not by totalRecordings) - use original Strapi logic ----

      if (hasRecordings) {
        let query = knex("recordings_follower_lnk as rf")
          .distinct("rf.follower_id")
          .innerJoin("recordings as r", "rf.recording_id", "r.id")
          .innerJoin("recordings_sources_lnk as rs", "rs.recording_id", "r.id")
          .innerJoin("sources as s", "rs.source_id", "s.id")
          .where("s.state", "!=", "failed");

        if (scope === "following" && followingIds.length > 0) {
          query = query.whereIn("rf.follower_id", followingIds);
        } else if (scope === "discover" && followingIds.length > 0) {
          query = query.whereNotIn("rf.follower_id", followingIds);
        }

        const followerIdsWithRecordings = await query.pluck("follower_id");

        if (followerIdsWithRecordings.length === 0) {
          return {
            data: [],
            meta: {
              pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 },
            },
          };
        }

        Object.assign(ctx.query, {
          filters: Object.assign({}, ctx.query.filters, {
            id: { $in: followerIdsWithRecordings },
          }),
        });
      } else {
        const scopeFilters: Record<string, object | null> = {
          following: { $in: followingIds },
          discover: followingIds.length > 0 ? { $notIn: followingIds } : null,
        };

        if (scope && scopeFilters[scope]) {
          Object.assign(ctx.query, {
            filters: Object.assign({}, ctx.query.filters, {
              id: scopeFilters[scope],
            }),
          });
        }
      }

      const result = await super.find(ctx);

      const dataWithMeta = await Promise.all(
        result.data.map(async (follower) => {
          const recordingsQuery: any = {
            filters: { follower: { id: { $eq: follower.id } } },
            limit: 5,
            sort: { createdAt: "desc" },
          };

          if (recordingsPopulate?.populate) {
            recordingsQuery.populate = recordingsPopulate.populate;
          }

          const [totalRecordings, recordings] = await Promise.all([
            strapi.documents("api::recording.recording").count({
              ...recordingsQuery,
              limit: undefined,
            }),
            recordingsPopulate
              ? strapi
                  .documents("api::recording.recording")
                  .findMany(recordingsQuery)
              : Promise.resolve(undefined),
          ]);

          return {
            ...follower,
            ...(recordings !== undefined && {
              recordings: recordings.filter((r) => r.sources?.length > 0),
            }),
            isFollowing: followingIds.includes(follower.id),
            totalRecordings,
          };
        })
      );

      return {
        data: dataWithMeta,
        meta: result.meta,
      };
    },
    async follow(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const { username, type } = ctx.request.body;

      // Get current user with existing followers
      const currentUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          populate: ["followers", "role"],
        });

      // Find or create follower
      let follower = await strapi
        .documents("api::follower.follower")
        .findFirst({
          filters: { username, type },
        });

      if (!follower) {
        follower = await strapi.documents("api::follower.follower").create({
          data: { username, type },
        });
      } else {
        follower = await strapi.documents("api::follower.follower").update({
          documentId: follower.documentId,
          data: { lastCheckedAt: new Date() },
        });
      }

      const totalFollowers = currentUser.followers
        ? currentUser.followers.length
        : 0;

      if (currentUser.role.type === "authenticated" && totalFollowers >= 3) {
        return ctx.forbidden("You already follow the maximum of 3 followers.");
      }

      if (currentUser.role.type === "champion" && totalFollowers >= 50) {
        return ctx.forbidden("You already follow the maximum of 50 followers.");
      }

      if (currentUser.role.type === "premium" && totalFollowers >= 100) {
        return ctx.forbidden(
          "You already follow the maximum of 100 followers."
        );
      }

      // Get all existing documentIds + new one
      const existingDocIds =
        currentUser.followers?.map((f) => f.documentId) || [];

      if (!existingDocIds.includes(follower.documentId)) {
        existingDocIds.push(follower.documentId);
      }

      // Update with connect using documentIds
      const updatePayload = {
        documentId: user.documentId,
        data: {
          followers: {
            connect: existingDocIds,
          },
        },
      };

      await strapi
        .documents("plugin::users-permissions.user")
        .update(updatePayload);

      return { data: follower };
    },
    async unfollow(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const { username, type } = ctx.request.body;

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          populate: {
            followers: {
              fields: ["id", "documentId", "username", "type"],
              filters: {
                username,
                type,
              },
            },
          },
        });

      const followerToRemove = fullUser.followers?.find(
        (f) => f.username === username && f.type === type
      );

      if (!followerToRemove) {
        return ctx.notFound();
      }

      await strapi.documents("plugin::users-permissions.user").update({
        documentId: user.documentId,
        data: {
          followers: {
            disconnect: [followerToRemove.documentId],
          },
        },
      });

      return { success: true };
    },
    async bulkUpdateLastChecked(ctx) {
      const { documentIds } = ctx.request.body;

      const result = await strapi.db
        .query("api::follower.follower")
        .updateMany({
          where: { documentId: { $in: documentIds } },
          data: { lastCheckedAt: new Date() },
        });

      return {
        requested: documentIds.length,
        updated: result.count,
      };
    },
  })
);
