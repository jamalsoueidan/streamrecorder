import { factories } from "@strapi/strapi";
import _ from "lodash";

const toCamelCase = (obj: Record<string, any>) =>
  _.mapKeys(obj, (_v, k) => _.camelCase(k));

export default factories.createCoreController(
  "api::clip.clip",
  ({ strapi }) => {
    // Shared helper to get follower IDs for user
    const getFollowerIds = async (userId: number) => {
      const followers = await strapi
        .documents("api::follower.follower")
        .findMany({
          filters: { owner: { id: userId } },
          fields: ["id"],
        });
      return followers.map((f) => f.id);
    };

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
          limit: 1,
        });

      const shareByClipId = new Map<string | number, any>();
      for (const share of clipShares) {
        const clipId = share.clip?.id;
        if (clipId && !shareByClipId.has(clipId)) {
          const { clip, ...shareData } = share;
          shareByClipId.set(clipId, shareData);
        }
      }

      return clips.map((clip) => ({
        ...clip,
        clipShare: shareByClipId.get(clip.id) || null,
      }));
    };

    return {
      async meFind(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        const followerIds = await getFollowerIds(user.id);

        if (followerIds.length === 0) {
          return {
            data: [],
            meta: {
              pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 },
            },
          };
        }

        ctx.query = {
          ...ctx.query,
          filters: {
            ...((ctx.query.filters as object) || {}),
            follower: { id: { $in: followerIds } },
          },
        };

        const result = await super.find(ctx);

        if (result.data?.length > 0) {
          result.data = await attachClipShares(result.data, user.id);
        }

        return result;
      },

      async meFindOne(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        const { id } = ctx.params;
        const followerIds = await getFollowerIds(user.id);

        if (followerIds.length === 0) {
          return ctx.notFound();
        }

        ctx.query = {
          ...ctx.query,
          filters: {
            ...((ctx.query.filters as object) || {}),
            follower: { id: { $in: followerIds } },
            documentId: id,
          },
          pagination: { limit: 1 },
        };

        const result = await super.find(ctx);

        if (!result.data?.length) {
          return ctx.notFound();
        }

        const [clip] = await attachClipShares(result.data, user.id);
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
