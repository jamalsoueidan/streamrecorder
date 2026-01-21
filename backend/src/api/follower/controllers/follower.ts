import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::follower.follower",
  ({ strapi }) => ({
    async browse(ctx) {
      const user = ctx.state.user;

      // Parse params
      const scope = ctx.query.scope as string | undefined;
      const hasRecordings = ctx.query.hasRecordings === "true";
      const sort = ctx.query.sort as string | undefined;
      const includeRecordings = scope === "discover";

      const sortField = sort?.split(":")[0] || "createdAt";
      const sortDirection = sort?.includes(":desc") ? "DESC" : "ASC";

      const knex = strapi.db.connection;
      const filters = ctx.query.filters as any;
      const pagination = ctx.query.pagination as
        | { page?: string; pageSize?: string }
        | undefined;
      const page = parseInt(pagination?.page || "1");
      const pageSize = parseInt(pagination?.pageSize || "25");
      const offset = (page - 1) * pageSize;

      // Get following IDs
      let followingIds = [];
      if (user) {
        const fullUser = await strapi
          .documents("plugin::users-permissions.user")
          .findOne({
            documentId: user?.documentId,
            fields: ["id"],
            populate: { followers: { fields: ["id"] } },
          });
        followingIds = fullUser?.followers?.map((f) => f.id) || [];
      }

      if (scope === "following" && followingIds.length === 0) {
        return {
          data: [],
          meta: {
            pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 },
          },
        };
      }

      const escapeLikePattern = (value: string): string => {
        return value
          .replace(/\\/g, "\\\\")
          .replace(/%/g, "\\%")
          .replace(/_/g, "\\_");
      };

      // Shared filter function
      const applyBaseFilters = (q: any) => {
        if (scope === "following" && followingIds.length > 0) {
          q = q.whereIn("f.id", followingIds);
        } else if (scope === "discover" && followingIds.length > 0) {
          q = q.whereNotIn("f.id", followingIds);
        }

        if (filters?.country?.$eq) {
          q = q.where("f.country", filters.country.$eq);
        }
        if (filters?.countryCode?.$eq) {
          q = q.where("f.country_code", filters.countryCode.$eq);
        }
        if (filters?.language?.$eq) {
          q = q.where("f.language", filters.language.$eq);
        }
        if (filters?.languageCode?.$eq) {
          q = q.where("f.language_code", filters.languageCode.$eq);
        }
        if (filters?.gender?.$eq) {
          q = q.where("f.gender", filters.gender.$eq);
        }
        if (filters?.type?.$eq) {
          q = q.where("f.type", filters.type.$eq);
        }

        if (filters?.$or) {
          const searchTerm =
            filters.$or[0]?.username?.$containsi ||
            filters.$or[0]?.nickname?.$containsi;
          if (searchTerm) {
            const escaped = escapeLikePattern(searchTerm);
            q = q.where(function (this: any) {
              this.whereILike("f.username", `%${escaped}%`).orWhereILike(
                "f.nickname",
                `%${escaped}%`,
              );
            });
          }
        }

        return q;
      };

      // hasRecordings EXISTS subquery (for count query)
      const applyHasRecordingsExists = (q: any) => {
        return q.whereExists(function (this: any) {
          this.select(knex.raw("1"))
            .from("recordings_follower_lnk as rf")
            .innerJoin("recordings as r", "rf.recording_id", "r.id")
            .innerJoin(
              "recordings_sources_lnk as rs",
              "rs.recording_id",
              "r.id",
            )
            .innerJoin("sources as s", "rs.source_id", "s.id")
            .whereRaw("rf.follower_id = f.id")
            .where("s.state", "!=", "failed");
        });
      };

      // Main query - select all follower fields + avatar + stats
      let query = knex("followers as f")
        .select(
          "f.*",
          knex.raw(`(
      SELECT files.url
      FROM files_related_mph frm
      JOIN files ON files.id = frm.file_id
      WHERE frm.related_id = f.id
      AND frm.related_type = 'api::follower.follower'
      AND frm.field = 'avatar'
      LIMIT 1
    ) as avatar_url`),
          knex.raw("COUNT(DISTINCT vr.recording_id) as total_recordings"),
          knex.raw("MAX(vr.created_at) as latest_recording"),
        )
        .leftJoin(
          knex("recordings as r")
            .select("r.id as recording_id", "r.created_at", "rf.follower_id")
            .innerJoin(
              "recordings_follower_lnk as rf",
              "rf.recording_id",
              "r.id",
            )
            .innerJoin(
              "recordings_sources_lnk as rs",
              "rs.recording_id",
              "r.id",
            )
            .innerJoin("sources as s", "rs.source_id", "s.id")
            .where("s.state", "!=", "failed")
            .groupBy("r.id", "r.created_at", "rf.follower_id")
            .as("vr"),
          "vr.follower_id",
          "f.id",
        )
        .groupBy("f.id");

      // Apply base filters
      query = applyBaseFilters(query);

      // hasRecordings - use HAVING for main query
      if (hasRecordings) {
        query = query.having(knex.raw("COUNT(DISTINCT vr.recording_id) > 0"));
      }

      // Sort
      switch (sortField) {
        case "totalRecordings":
          query = query.orderByRaw(
            `COUNT(DISTINCT vr.recording_id) ${sortDirection}, f.id ASC`,
          );
          break;
        case "latestRecording":
          query = query.orderByRaw(
            `MAX(vr.created_at) ${sortDirection} NULLS LAST, f.id ASC`,
          );
          break;
        case "username":
          query = query.orderByRaw(`f.username ${sortDirection}, f.id ASC`);
          break;
        default:
          query = query.orderByRaw(`f.created_at ${sortDirection}, f.id ASC`);
      }

      // Pagination
      query = query.limit(pageSize).offset(offset);

      // Count query - separate, no GROUP BY
      let countQuery = knex("followers as f").countDistinct("f.id as total");
      countQuery = applyBaseFilters(countQuery);
      if (hasRecordings) {
        countQuery = applyHasRecordingsExists(countQuery);
      }

      // Execute both
      const [rows, countResult] = await Promise.all([
        query,
        countQuery.first(),
      ]);
      const total = Number(countResult?.total || 0);

      if (rows.length === 0) {
        return {
          data: [],
          meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } },
        };
      }

      const followerIds = rows.map((r: any) => r.id);

      // Fetch recordings if needed (discover only)
      let recordingsMap = new Map<number | string, any[]>();
      if (includeRecordings) {
        const recordings = await strapi
          .documents("api::recording.recording")
          .findMany({
            filters: { follower: { id: { $in: followerIds } } },
            populate: {
              sources: {
                filters: { state: { $ne: "failed" } },
                populate: ["videoSmall", "videoOriginal"],
              },
              follower: { fields: ["id"] },
            },
            sort: { createdAt: "desc" },
          });

        for (const rec of recordings) {
          if (rec.sources?.length > 0) {
            const fId = rec.follower?.id;
            if (!recordingsMap.has(fId)) recordingsMap.set(fId, []);
            if (recordingsMap.get(fId)!.length < 5) {
              recordingsMap.get(fId)!.push(rec);
            }
          }
        }
      }

      const snakeToCamel = (obj: any): any => {
        if (obj === null || typeof obj !== "object") return obj;

        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
            value,
          ]),
        );
      };

      const data = rows.map((row: any) => ({
        ...snakeToCamel(row),
        totalRecordings: Number(row.total_recordings),
        avatar: row.avatar_url ? { url: row.avatar_url } : null,
        recordings: recordingsMap.get(row.id) || [],
        isFollowing: followingIds.includes(row.id),
      }));

      return {
        data,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
            total,
          },
        },
      };
    },
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
    async follow(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const body = ctx.request.body;

      const username = body.username.trim(); // ✅ Keep original casing
      const type = body.type.trim();

      const currentUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          populate: ["followers", "role"],
        });

      let follower = await strapi
        .documents("api::follower.follower")
        .findFirst({
          filters: {
            username: { $eqi: username }, // ✅ Case-insensitive search
            type,
          },
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
          "You already follow the maximum of 100 followers.",
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
        (f) => f.username === username && f.type === type,
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
    async cleanup(ctx) {
      // delete users who is 7 days old and still have no recordings
      const days = parseInt(ctx.query.days as string) || 7;
      const limit = parseInt(ctx.query.limit as string) || 50;
      const destroy = ctx.query.destroy === "true";

      const knex = strapi.db.connection;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const staleFollowers = await knex("followers as f")
        .select("f.id", "f.document_id", "f.username", "f.type", "f.created_at")
        .leftJoin("recordings_follower_lnk as rfl", "rfl.follower_id", "f.id")
        .where("f.created_at", "<", cutoffDate.toISOString())
        .groupBy("f.id")
        .having(knex.raw("COUNT(rfl.recording_id) = 0"))
        .limit(limit);

      if (!destroy) {
        return {
          message: "Preview - no deletions",
          count: staleFollowers.length,
          cutoffDate: cutoffDate.toISOString(),
          followers: staleFollowers,
        };
      }

      const ids = staleFollowers.map((f: any) => f.id);
      let deletedAvatars = 0;

      if (ids.length > 0) {
        const avatarFiles = await knex("files as f")
          .select("f.*")
          .innerJoin("files_related_mph as frm", "frm.file_id", "f.id")
          .whereIn("frm.related_id", ids)
          .where("frm.related_type", "api::follower.follower")
          .where("frm.field", "avatar");

        for (const file of avatarFiles) {
          try {
            await strapi.plugin("upload").service("upload").remove(file);
            deletedAvatars++;
          } catch (err) {
            console.error(`Failed to delete avatar ${file.id}:`, err);
          }
        }

        await knex("files_related_mph")
          .whereIn("related_id", ids)
          .where("related_type", "api::follower.follower")
          .delete();

        await knex("followers").whereIn("id", ids).delete();
      }

      return {
        message: "Deleted stale followers and their avatars",
        followersDeleted: ids.length,
        avatarsDeleted: deletedAvatars,
        cutoffDate: cutoffDate.toISOString(),
        deleted: staleFollowers,
      };
    },
  }),
);
