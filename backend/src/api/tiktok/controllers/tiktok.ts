/**
 * tiktok controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::tiktok.tiktok",
  ({ strapi }) => ({
    async login(ctx) {
      const { openId, accessToken, refreshToken, expiresAt, username } =
        ctx.request.body || {};

      if (!openId || !accessToken || !refreshToken || !expiresAt) {
        return ctx.badRequest("Missing required fields");
      }

      const existingTiktok = await strapi
        .documents("api::tiktok.tiktok")
        .findFirst({
          filters: { openId },
          populate: {
            user: {
              fields: ["id", "documentId", "username", "email", "blocked"],
            },
          },
        });

      let user: any;
      let isNewUser = false;

      if (existingTiktok) {
        // Update tokens
        await strapi.documents("api::tiktok.tiktok").update({
          documentId: existingTiktok.documentId,
          data: { accessToken, refreshToken, expiresAt },
        });

        if (existingTiktok.user) {
          if (existingTiktok.user.blocked) {
            return ctx.badRequest("Your account has been blocked");
          }
          user = existingTiktok.user;
        } else {
          // Orphaned tiktok record — find user by email or create one
          isNewUser = true;
          const email = `tiktok_${openId}@noreply.tiktok`;

          user = await strapi
            .documents("plugin::users-permissions.user")
            .findFirst({ filters: { email } });

          if (!user) {
            const defaultRole = await strapi
              .documents("plugin::users-permissions.role")
              .findFirst({ filters: { type: "authenticated" } });

            user = await strapi
              .documents("plugin::users-permissions.user")
              .create({
                data: {
                  username: username || `tiktok_${openId.slice(0, 8)}`,
                  email,
                  provider: "tiktok",
                  confirmed: true,
                  role: defaultRole?.documentId,
                } as any,
              });
          }

          // Link tiktok record to user
          await strapi.documents("api::tiktok.tiktok").update({
            documentId: existingTiktok.documentId,
            data: { user: user.documentId },
          });
        }
      } else {
        isNewUser = true;
        const email = `tiktok_${openId}@noreply.tiktok`;

        // Check if user already exists (e.g. from a previous failed attempt)
        user = await strapi
          .documents("plugin::users-permissions.user")
          .findFirst({ filters: { email } });

        if (!user) {
          const defaultRole = await strapi
            .documents("plugin::users-permissions.role")
            .findFirst({ filters: { type: "authenticated" } });

          user = await strapi
            .documents("plugin::users-permissions.user")
            .create({
              data: {
                username: username || `tiktok_${openId.slice(0, 8)}`,
                email,
                provider: "tiktok",
                confirmed: true,
                role: defaultRole?.documentId,
              } as any,
            });
        }

        await strapi.documents("api::tiktok.tiktok").create({
          data: {
            openId,
            accessToken,
            refreshToken,
            expiresAt,
            user: user.documentId,
          },
        });
      }

      const jwt = strapi
        .plugin("users-permissions")
        .service("jwt")
        .issue({ id: user.id });

      return {
        jwt,
        user: { id: user.id, username: user.username },
        isNewUser,
      };
    },

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
