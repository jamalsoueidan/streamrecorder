import { factories } from "@strapi/strapi";
import _ from "lodash";

const toCamelCase = (obj: Record<string, any>) =>
  _.mapKeys(obj, (_v, k) => _.camelCase(k));

export default factories.createCoreController(
  "api::clip.clip",
  ({ strapi }) => ({
    async me(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      // Get followers owned by this user
      const followers = await strapi.documents("api::follower.follower").findMany({
        filters: { owner: { id: user.id } },
        fields: ["id"],
      });

      const followerIds = followers.map((f) => f.id);

      if (followerIds.length === 0) {
        return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
      }

      // Filter clips by those followers
      ctx.query = {
        ...ctx.query,
        filters: {
          ...((ctx.query.filters as object) || {}),
          follower: { id: { $in: followerIds } },
        },
      };

      return super.find(ctx);
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
  }),
);
