import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::follower.follower",
  ({ strapi }) => ({
    async filters(cxt) {
      const knex = strapi.db.connection;

      const [countries, genders, languages, types] = await Promise.all([
        knex("followers")
          .select("country as value")
          .count("* as count")
          .whereNotNull("country")
          .where("country", "!=", "")
          .groupBy("country")
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
          .select("type as value")
          .count("* as count")
          .whereNotNull("type")
          .where("type", "!=", "")
          .groupBy("type")
          .orderBy("count", "desc"),
      ]);

      return {
        countries,
        genders,
        languages,
        types,
      };
    },
    async browse(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      // Extract and remove scope from query
      const scope = ctx.query.scope as string | undefined;
      const hasRecordings = ctx.query.hasRecordings === "true";

      delete ctx.query.scope;
      delete ctx.query.hasRecordings;

      // Extract and remove recordings populate config
      const recordingsPopulate = (ctx.query.populate as any)?.recordings;
      if (recordingsPopulate) {
        delete (ctx.query.populate as any).recordings;
      }

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: { followers: { fields: ["id"] } },
        });

      const followingIds = fullUser?.followers?.map((f) => f.id) || [];

      // If scope is "FOLLOWING" and user follows no one, return empty result because [] will return all records
      if (scope === "following" && followingIds.length === 0) {
        return {
          data: [],
          meta: {
            pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 },
          },
        };
      }

      if (hasRecordings) {
        const knex = strapi.db.connection;

        let query = knex("recordings_follower_lnk as rf")
          .distinct("rf.follower_id")
          // Join to recordings to check for valid sources
          .innerJoin("recordings as r", "rf.recording_id", "r.id")
          .innerJoin("recordings_sources_lnk as rs", "rs.recording_id", "r.id")
          .innerJoin("sources as s", "rs.source_id", "s.id")
          .where("s.state", "!=", "failed");

        // Apply scope filter directly in SQL
        if (scope === "following" && followingIds.length > 0) {
          query = query.whereIn("follower_id", followingIds);
        } else if (scope === "discover" && followingIds.length > 0) {
          query = query.whereNotIn("follower_id", followingIds);
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
        // Only apply scope filter when hasRecordings=false
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
          // Build recordings query, mimicking frontend populate
          const recordingsQuery: any = {
            filters: {
              follower: { id: { $eq: follower.id } },
            },

            limit: 5,
            sort: { createdAt: "desc" },
          };

          // Apply nested populate if it was requested
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

      if (currentUser.role.type === "founder" && totalFollowers >= 50) {
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
