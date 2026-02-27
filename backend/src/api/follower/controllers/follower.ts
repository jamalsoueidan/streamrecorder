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
        q = q.where("f.locale", ctx.query.locale || "en");

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
              "sources_recording_lnk as srl",
              "srl.recording_id",
              "r.id",
            )
            .innerJoin("sources as s", "srl.source_id", "s.id")
            .whereRaw("rf.follower_id = f.id")
            .where("s.state", "!=", "failed");
        });
      };

      // Main query - select all follower fields + avatar + stats
      let query = knex("followers as f")
        .select(
          "f.*",
          "fol.user_id as owner_id",
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
        .leftJoin("followers_owner_lnk as fol", "fol.follower_id", "f.id")
        .leftJoin(
          knex("recordings as r")
            .select("r.id as recording_id", "r.created_at", "rf.follower_id")
            .innerJoin(
              "recordings_follower_lnk as rf",
              "rf.recording_id",
              "r.id",
            )
            .innerJoin(
              "sources_recording_lnk as srl",
              "srl.recording_id",
              "r.id",
            )
            .innerJoin("sources as s", "srl.source_id", "s.id")
            .where("s.state", "!=", "failed")
            .groupBy("r.id", "r.created_at", "rf.follower_id")
            .as("vr"),
          "vr.follower_id",
          "f.id",
        )
        .groupBy("f.id", "fol.user_id");

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
        owner: row.owner_id ? { id: row.owner_id } : null,
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
    async filters(ctx) {
      const knex = strapi.db.connection;
      const { type } = ctx.query;

      const baseQuery = () => {
        const q = knex("followers");
        if (type) q.where("type", type);
        return q;
      };

      const [countryCodes, genders, languageCodes, types] = await Promise.all([
        baseQuery()
          .select("country_code as value")
          .count("* as count")
          .whereNotNull("country_code")
          .where("country_code", "!=", "")
          .groupBy("country_code")
          .orderBy("count", "desc"),

        baseQuery()
          .select("gender as value")
          .count("* as count")
          .whereNotNull("gender")
          .where("gender", "!=", "")
          .groupBy("gender")
          .orderBy("count", "desc"),

        baseQuery()
          .select("language_code as value")
          .count("* as count")
          .whereNotNull("language_code")
          .where("language_code", "!=", "")
          .groupBy("language_code")
          .orderBy("count", "desc"),

        baseQuery()
          .select("type as value")
          .count("* as count")
          .whereNotNull("type")
          .where("type", "!=", "")
          .groupBy("type")
          .orderBy("count", "desc"),
      ]);

      return {
        countryCodes,
        genders,
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
        return ctx.forbidden("MAX_3_FOLLOWERS");
      }

      if (currentUser.role.type === "champion" && totalFollowers >= 50) {
        return ctx.forbidden("MAX_50_FOLLOWERS");
      }

      if (currentUser.role.type === "premium" && totalFollowers >= 100) {
        return ctx.forbidden("MAX_100_FOLLOWERS");
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
    async connectUserWithFollower(ctx) {
      const body = ctx.request.body;

      const username = body.username.trim();
      const type = body.type.trim();
      const userDocumentId = ctx.params.userDocumentId;

      const currentUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: userDocumentId,
          populate: ["followers"],
        });

      if (!currentUser) {
        return ctx.notFound("USER_NOT_FOUND");
      }

      let follower = await strapi
        .documents("api::follower.follower")
        .findFirst({
          filters: {
            username: { $eqi: username },
            type,
          },
        });

      if (!follower) {
        return ctx.notFound("FOLLOWER_NOT_FOUND");
      }

      // Get all existing documentIds + new one
      const existingDocIds =
        currentUser.followers?.map((f) => f.documentId) || [];

      if (!existingDocIds.includes(follower.documentId)) {
        existingDocIds.push(follower.documentId);
      }

      // Update with connect using documentIds
      const updatePayload = {
        documentId: userDocumentId,
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
        return ctx.notFound("FOLLOWER_NOT_FOUND");
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
      const days = Math.max(1, parseInt(ctx.query.days as string) || 14);
      const limit = Math.min(100, Math.max(1, parseInt(ctx.query.limit as string) || 50));
      const destroy = ctx.query.destroy === "true";

      const knex = strapi.db.connection;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Step 1: get all follower integer IDs that have any recording link (no join, fast scan)
      console.log("[cleanup] Step 1/2 - Fetching follower IDs with recordings...");
      const linkedFollowerIds = await knex("recordings_follower_lnk")
        .distinct("follower_id")
        .pluck("follower_id");
      console.log(`[cleanup] ${linkedFollowerIds.length} follower IDs have recordings.`);

      // Step 2: resolve their document_ids so we exclude all locales of those documents
      console.log("[cleanup] Step 2/2 - Resolving document IDs...");
      const docIdsWithRecordings = linkedFollowerIds.length > 0
        ? await knex("followers")
            .whereIn("id", linkedFollowerIds)
            .distinct("document_id")
            .pluck("document_id")
        : [];
      console.log(`[cleanup] ${docIdsWithRecordings.length} unique follower documents have recordings, excluding them.`);

      const baseQuery = () => {
        let q = knex("followers as f")
          .where("f.locale", "en")
          .where("f.created_at", "<", cutoffDate.toISOString());
        if (docIdsWithRecordings.length > 0) {
          q = q.whereNotIn("f.document_id", docIdsWithRecordings);
        }
        return q;
      };

      console.log("[cleanup] Counting stale followers...");
      const [staleFollowers, countResult] = await Promise.all([
        baseQuery()
          .select("f.id", "f.document_id", "f.username", "f.type", "f.created_at")
          .limit(limit),
        baseQuery().countDistinct("f.id as total").first(),
      ]);

      const total = Number(countResult?.total || 0);

      if (!destroy) {
        const previewDocumentIds = staleFollowers.map((f: any) => f.document_id);
        let previewAvatars = [];

        if (previewDocumentIds.length > 0) {
          const previewEnIds = staleFollowers.map((f: any) => f.id);

          previewAvatars = await knex("files as f")
            .distinct("f.id", "f.name", "f.url", "f.provider")
            .innerJoin("files_related_mph as frm", "frm.file_id", "f.id")
            .whereIn("frm.related_id", previewEnIds)
            .where("frm.related_type", "api::follower.follower")
            .where("frm.field", "avatar");
        }

        return {
          message: "Preview - no deletions",
          total,
          count: staleFollowers.length,
          limit,
          avatarCount: previewAvatars.length,
          cutoffDate: cutoffDate.toISOString(),
          followers: staleFollowers,
          avatars: previewAvatars,
        };
      }

      const documentIds = staleFollowers.map((f: any) => f.document_id);
      const enIds = staleFollowers.map((f: any) => f.id);
      let deletedAvatars = 0;

      console.log(`[cleanup] Processing ${documentIds.length} stale followers...`);

      if (documentIds.length > 0) {
        console.log("[cleanup] Finding avatar files...");
        const avatarFileIds = await knex("files as f")
          .distinct("f.id")
          .innerJoin("files_related_mph as frm", "frm.file_id", "f.id")
          .whereIn("frm.related_id", enIds)
          .where("frm.related_type", "api::follower.follower")
          .where("frm.field", "avatar")
          .then((rows: any[]) => rows.map((r) => r.id));

        const avatarFiles = avatarFileIds.length > 0
          ? await knex("files").whereIn("id", avatarFileIds)
          : [];

        console.log(`[cleanup] Deleting ${avatarFiles.length} avatar files from S3...`);
        const results = await Promise.allSettled(
          avatarFiles.map((file) =>
            strapi.plugin("upload").service("upload").remove(file),
          ),
        );
        deletedAvatars = results.filter((r) => r.status === "fulfilled").length;
        results.forEach((r, i) => {
          if (r.status === "rejected") {
            console.error(`[cleanup] Failed to delete avatar ${avatarFiles[i].id}:`, r.reason);
          }
        });
        console.log(`[cleanup] Deleted ${deletedAvatars}/${avatarFiles.length} avatars.`);

        console.log("[cleanup] Cleaning up file relations...");
        await knex("files_related_mph")
          .whereIn("related_id", enIds)
          .where("related_type", "api::follower.follower")
          .delete();

        console.log("[cleanup] Deleting follower rows (all locales)...");
        await knex("followers").whereIn("document_id", documentIds).delete();
        console.log("[cleanup] Done.");
      }

      return {
        message: "Deleted stale followers and their avatars",
        total,
        followersDeleted: documentIds.length,
        remaining: total - documentIds.length,
        avatarsDeleted: deletedAvatars,
        cutoffDate: cutoffDate.toISOString(),
        deleted: staleFollowers,
      };
    },
  }),
);
