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
      const favoritesOnly = ctx.query.favorites === "true";

      const populateFields: Record<string, { fields: string[] }> = {
        followers: { fields: ["id"] },
      };
      if (favoritesOnly) {
        populateFields.favorites = { fields: ["id"] };
      }

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: populateFields,
          status: "published",
        });

      ctx.query.locale = ctx.query.locale || "en";

      const followingIds =
        (fullUser as any)?.followers?.map((f: any) => f.id) || [];
      const favoriteIds = favoritesOnly
        ? (fullUser as any)?.favorites?.map((f: any) => f.id) || []
        : [];

      // Determine which follower IDs to filter by
      let followerIdFilter: object | null = null;

      if (favoritesOnly) {
        followerIdFilter = {
          $in: favoriteIds.length === 0 ? [0] : favoriteIds,
        };
      } else if (scope === "following") {
        followerIdFilter = {
          $in: followingIds.length === 0 ? [0] : followingIds,
        };
      } else if (scope === "discover" && followingIds.length > 0) {
        followerIdFilter = { $notIn: followingIds };
      }

      if (followerIdFilter) {
        const filters = (ctx.query.filters ?? {}) as Record<string, any>;

        ctx.query.filters = {
          ...filters,
          follower: {
            ...(filters.follower ?? {}),
            id: followerIdFilter,
          },
        };
      }

      return super.find(ctx);
    },
    async search(ctx) {
      ctx.query = { ...ctx.query, ...((ctx.request.body as any) || {}) };
      return await (this as any).find(ctx);
    },
  }),
);
