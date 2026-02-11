/**
 * tiktok controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::tiktok.tiktok",
  ({ strapi }) => ({
    async meFind(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      const tiktok = await strapi.documents("api::tiktok.tiktok").findFirst({
        filters: { user: { id: user.id } },
      });

      return { data: tiktok || null };
    },
    async meCreate(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      // Check if user already has a tiktok
      const existing = await strapi.documents("api::tiktok.tiktok").findFirst({
        filters: { user: { id: user.id } },
      });

      if (existing) {
        return ctx.badRequest("You already have a TikTok account linked");
      }

      // Create directly with documents API
      const data = ctx.request.body.data || {};
      const tiktok = await strapi.documents("api::tiktok.tiktok").create({
        data: {
          ...data,
          user: {
            connect: [user.documentId],
          },
        },
      });

      return { data: tiktok };
    },
    async meUpdate(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      const { id } = ctx.params;

      // Check if tiktok belongs to user
      const tiktok = await strapi.documents("api::tiktok.tiktok").findOne({
        documentId: id,
        populate: { user: { fields: ["id"] } },
      });

      if (!tiktok) {
        return ctx.notFound();
      }

      if (tiktok.user?.id !== user.id) {
        return ctx.forbidden("You can only update your own TikTok account");
      }

      return super.update(ctx);
    },

    async meDelete(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      const { id } = ctx.params;

      // Check if tiktok belongs to user
      const tiktok = await strapi.documents("api::tiktok.tiktok").findOne({
        documentId: id,
        populate: { user: { fields: ["id"] } },
      });

      if (!tiktok) {
        return ctx.notFound();
      }

      if (tiktok.user?.id !== user.id) {
        return ctx.forbidden("You can only delete your own TikTok account");
      }

      return super.delete(ctx);
    },
  }),
);
