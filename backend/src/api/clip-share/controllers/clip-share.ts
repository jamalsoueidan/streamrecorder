/**
 * clip-share controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::clip-share.clip-share",
  ({ strapi }) => {
    const checkOwnership = async (documentId: string, userId: number) => {
      const clipShare = await strapi
        .documents("api::clip-share.clip-share")
        .findOne({
          documentId,
          populate: { user: { fields: ["id"] } },
        });

      if (!clipShare) return { error: "notFound" };
      if (clipShare.user?.id !== userId) return { error: "forbidden" };
      return { clipShare };
    };

    return {
      async meCreate(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

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

      async meUpdate(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        const { id } = ctx.params;
        const check = await checkOwnership(id, user.id);

        if (check.error === "notFound") return ctx.notFound();
        if (check.error === "forbidden")
          return ctx.forbidden("You can only update your own");

        return super.update(ctx);
      },

      async meDelete(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        const { id } = ctx.params;
        const check = await checkOwnership(id, user.id);

        if (check.error === "notFound") return ctx.notFound();
        if (check.error === "forbidden")
          return ctx.forbidden("You can only delete your own");

        return super.delete(ctx);
      },
    };
  },
);
