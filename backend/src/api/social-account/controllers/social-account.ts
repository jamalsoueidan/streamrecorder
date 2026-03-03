/**
 * social-account controller
 */

import { factories } from "@strapi/strapi";

const ALLOWED_PROVIDERS = ["google", "apple", "facebook"];

export default factories.createCoreController(
  "api::social-account.social-account",
  ({ strapi }) => ({
    async login(ctx) {
      const {
        provider,
        providerId,
        accessToken,
        refreshToken,
        expiresAt,
        email,
        displayName,
      } = ctx.request.body || {};

      if (!provider || !providerId || !accessToken || !expiresAt) {
        return ctx.badRequest("Missing required fields");
      }

      if (!ALLOWED_PROVIDERS.includes(provider)) {
        return ctx.badRequest("Invalid provider");
      }

      const existing = await strapi
        .documents("api::social-account.social-account")
        .findFirst({
          filters: { provider, providerId },
          populate: {
            user: {
              fields: ["id", "documentId", "username", "email", "blocked"],
            },
          },
        });

      let user: any;
      let isNewUser = false;

      if (existing) {
        // Update tokens
        await strapi.documents("api::social-account.social-account").update({
          documentId: existing.documentId,
          data: { accessToken, refreshToken, expiresAt, email },
        });

        if (existing.user) {
          if (existing.user.blocked) {
            return ctx.badRequest("Your account has been blocked");
          }
          user = existing.user;
        } else {
          // Orphaned social account — find user by email or create one
          isNewUser = true;
          const userEmail =
            email || `${provider}_${providerId}@noreply.social`;

          user = await strapi
            .documents("plugin::users-permissions.user")
            .findFirst({ filters: { email: userEmail } });

          if (!user) {
            const defaultRole = await strapi
              .documents("plugin::users-permissions.role")
              .findFirst({ filters: { type: "authenticated" } });

            user = await strapi
              .documents("plugin::users-permissions.user")
              .create({
                data: {
                  username:
                    displayName || `${provider}_${providerId.slice(0, 8)}`,
                  email: userEmail,
                  provider,
                  confirmed: true,
                  role: defaultRole?.documentId,
                } as any,
              });
          }

          // Link social account to user
          await strapi
            .documents("api::social-account.social-account")
            .update({
              documentId: existing.documentId,
              data: { user: user.documentId },
            });
        }
      } else {
        isNewUser = true;
        const userEmail = email || `${provider}_${providerId}@noreply.social`;

        // Check if user already exists
        user = await strapi
          .documents("plugin::users-permissions.user")
          .findFirst({ filters: { email: userEmail } });

        if (!user) {
          const defaultRole = await strapi
            .documents("plugin::users-permissions.role")
            .findFirst({ filters: { type: "authenticated" } });

          user = await strapi
            .documents("plugin::users-permissions.user")
            .create({
              data: {
                username:
                  displayName || `${provider}_${providerId.slice(0, 8)}`,
                email: userEmail,
                provider,
                confirmed: true,
                role: defaultRole?.documentId,
              } as any,
            });
        }

        await strapi.documents("api::social-account.social-account").create({
          data: {
            provider,
            providerId,
            accessToken,
            refreshToken,
            expiresAt,
            email,
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
  }),
);
