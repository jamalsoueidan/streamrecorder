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
          populate: { followers: { fields: ["id"] } },
          status: "published",
        });

      const followingIds = fullUser?.followers?.map((f) => f.id) || [];

      const scopeFilters: Record<string, object | null> = {
        following: { $in: followingIds },
        discover: followingIds.length > 0 ? { $notIn: followingIds } : null,
      };

      if (scope && scopeFilters[scope]) {
        Object.assign(ctx.query, {
          filters: Object.assign({}, ctx.query.filters, {
            follower: { id: scopeFilters[scope] },
          }),
        });
      }

      return super.find(ctx);
    },
  })
);
