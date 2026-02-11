/**
 * clip-share controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::clip-share.clip-share",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      // Create directly with documents API
      const data = ctx.request.body.data || {};
      const clipShare = await strapi
        .documents("api::clip-share.clip-share")
        .create({
          data: {
            ...data,
            user: {
              connect: [user.documentId],
            },
          },
        });

      return { data: clipShare };
    },
    async update(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      const { id } = ctx.params;

      // Check if belongs to user
      const clipShare = await strapi
        .documents("api::clip-share.clip-share")
        .findOne({
          documentId: id,
          populate: { user: { fields: ["id"] } },
        });

      if (!clipShare) {
        return ctx.notFound();
      }

      if (clipShare.user?.id !== user.id) {
        return ctx.forbidden("You can only update your own");
      }

      return super.update(ctx);
    },

    async delete(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      const { id } = ctx.params;

      // Check if clip-share belongs to user
      const clipShare = await strapi
        .documents("api::clip-share.clip-share")
        .findOne({
          documentId: id,
          populate: { user: { fields: ["id"] } },
        });

      if (!clipShare) {
        return ctx.notFound();
      }

      if (clipShare.user?.id !== user.id) {
        return ctx.forbidden("You can only delete your own");
      }

      return super.delete(ctx);
    },
  }),
);
