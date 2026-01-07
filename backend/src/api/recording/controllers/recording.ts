/**
 * recording controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::recording.recording",
  ({ strapi }) => ({
    async browse(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const scope = ctx.query.scope as string | undefined;

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: {
            followers: { fields: ["id"] },
          },
          status: "published",
        });

      const followingIds = fullUser?.followers?.map((f) => f.id) || [];

      const scopeFilters: Record<string, object | null> = {
        following: { $in: followingIds.length === 0 ? [0] : followingIds }, // 0 is when user have no followers so he dont get all videos
        discover: followingIds.length > 0 ? { $notIn: followingIds } : null,
      };

      if (scope && scopeFilters[scope]) {
        const filters = (ctx.query.filters ?? {}) as Record<string, any>;

        ctx.query.filters = {
          ...filters,
          follower: {
            ...(filters.follower ?? {}),
            id: scopeFilters[scope],
          },
        };
      }

      return super.find(ctx);
    },
    async count(ctx) {
      const minRecordings = parseInt(ctx.query.min as string) || 6;
      const limit = parseInt(ctx.query.limit as string) || 10;

      const knex = strapi.db.connection;

      const results = await knex("followers as f")
        .select("f.*")
        .countDistinct("r.id as recordings_count")
        .innerJoin("recordings_follower_lnk as rfl", "rfl.follower_id", "f.id")
        .innerJoin("recordings as r", "r.id", "rfl.recording_id")
        .innerJoin("recordings_sources_lnk as rsl", "rsl.recording_id", "r.id")
        .innerJoin("sources as s", "s.id", "rsl.source_id")
        .where(function () {
          this.whereNull("f.description").orWhere("f.description", "");
        })
        .where("s.state", "=", "done")
        .groupBy("f.id")
        .having(knex.raw("COUNT(DISTINCT r.id) >= ?", [minRecordings]))
        .orderBy("recordings_count", "desc")
        .limit(limit);

      return { data: results };
    },
  })
);
