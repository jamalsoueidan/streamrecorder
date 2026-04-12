import { factories } from "@strapi/strapi";
import _ from "lodash";

const toCamelCase = (obj: Record<string, any>) =>
  _.mapKeys(obj, (_v, k) => _.camelCase(k));

export default factories.createCoreController(
  "api::clip.clip",
  ({ strapi }) => {
    // Shared helper to get follower documentIds for user
    const getFollowerDocumentIds = async (userDocumentId: string) => {
      const user = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: userDocumentId,
          populate: { followers: { fields: ["documentId"] } },
        });
      return user?.followers?.map((f) => f.documentId) || [];
    };

    // Old version - get followers by owner
    // const getFollowerIds = async (userId: number) => {
    //   const followers = await strapi
    //     .documents("api::follower.follower")
    //     .findMany({
    //       filters: { owner: { id: userId } },
    //       fields: ["id"],
    //     });
    //   return followers.map((f) => f.id);
    // };

    // Shared helper to attach clip shares to clips
    const attachClipShares = async (clips: any[], userId: number) => {
      if (clips.length === 0) return clips;

      const clipIds = clips.map((c) => c.id);
      const clipShares = await strapi
        .documents("api::clip-share.clip-share")
        .findMany({
          filters: {
            clip: { id: { $in: clipIds } },
            user: { id: userId },
          },
          populate: { clip: { fields: ["id"] } },
          sort: { createdAt: "desc" },
        });

      // Group by clip ID, keep latest share per platform per clip
      const sharesByClipId = new Map<string | number, Map<string, any>>();
      for (const share of clipShares) {
        const clipId = share.clip?.id;
        if (!clipId) continue;
        if (!sharesByClipId.has(clipId)) {
          sharesByClipId.set(clipId, new Map());
        }
        const platformMap = sharesByClipId.get(clipId)!;
        // Keep only the latest share per platform (already sorted desc)
        if (!platformMap.has(share.platform)) {
          const { clip, ...shareData } = share;
          platformMap.set(share.platform, shareData);
        }
      }

      return clips.map((clip) => {
        const platformMap = sharesByClipId.get(clip.id);
        return {
          ...clip,
          clipShares: platformMap ? Object.fromEntries(platformMap) : {},
        };
      });
    };

    return {
      async meFind(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        const followerDocumentIds = await getFollowerDocumentIds(user.documentId);

        if (followerDocumentIds.length === 0) {
          return {
            data: [],
            meta: {
              pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 },
            },
          };
        }

        const { query } = ctx;
        const filters = {
          ...((query.filters as object) || {}),
          follower: { documentId: { $in: followerDocumentIds } },
        };

        // Extract pagination params (Strapi Document Service uses limit/start directly)
        const pagination = (query.pagination || {}) as Record<string, unknown>;
        const limit = Number(pagination.limit) || Number(pagination.pageSize) || 25;
        const start = Number(pagination.start) || 0;

        const results = await strapi.documents("api::clip.clip").findMany({
          ...query,
          filters,
          limit,
          start,
        });

        // Count using Document Service with same filters (no pagination)
        const allForCount = await strapi.documents("api::clip.clip").findMany({
          filters,
          fields: ["id"],
        });
        const total = allForCount.length;

        const data =
          results.length > 0
            ? await attachClipShares(results, user.id)
            : results;

        return {
          data,
          meta: {
            pagination: {
              page: Math.floor(start / limit) + 1,
              pageSize: limit,
              pageCount: Math.ceil(total / limit),
              total,
            },
          },
        };
      },

      async meFindOne(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        const { id } = ctx.params;
        const followerDocumentIds = await getFollowerDocumentIds(user.documentId);

        if (followerDocumentIds.length === 0) {
          return ctx.notFound();
        }

        const { query } = ctx;
        const filters = {
          ...((query.filters as object) || {}),
          follower: { documentId: { $in: followerDocumentIds } },
          documentId: id,
        };

        const results = await strapi.documents("api::clip.clip").findMany({
          ...query,
          filters,
          limit: 1,
        });

        if (!results.length) {
          return ctx.notFound();
        }

        const [clip] = await attachClipShares(results, user.id);
        return { data: clip };
      },

      async shuffle(ctx) {
        const limit = Number(ctx.query.limit) || 12;
        const knex = strapi.db.connection;

        // raw SQL query to select distinct clips based on follower_document_id
        const { rows } = await knex.raw(`
        SELECT DISTINCT ON (f.document_id) c.*, f.document_id as follower_document_id
        FROM clips c
        INNER JOIN clips_follower_lnk lnk ON c.id = lnk.clip_id
        INNER JOIN followers f ON lnk.follower_id = f.id
        ORDER BY f.document_id, RANDOM()`);

        const shuffled = rows
          .sort(() => Math.random() - 0.5)
          .slice(0, limit)
          .map(toCamelCase);

        return { data: shuffled };
      },
    };
  },
);
