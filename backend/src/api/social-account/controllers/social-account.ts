/**
 * social-account controller
 */

import { factories } from "@strapi/strapi";

const ALLOWED_PROVIDERS = ["google", "apple", "facebook", "tiktok"];

async function findUniqueUsername(strapi: any, base: string): Promise<string> {
  let username = base;
  let attempt = 0;
  while (true) {
    const exists = await strapi
      .documents("plugin::users-permissions.user")
      .findFirst({ filters: { username } });
    if (!exists) return username;
    attempt++;
    username = `${base}_${Math.random().toString(36).slice(2, 6)}`;
  }
}

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
        const userEmail = email || `${provider}_${providerId}@noreply.social`;

        // Try to find existing user by email
        user = await strapi
          .documents("plugin::users-permissions.user")
          .findFirst({ filters: { email: userEmail } });

        // Also check old TikTok email format for migrated users
        if (!user && provider === "tiktok") {
          user = await strapi
            .documents("plugin::users-permissions.user")
            .findFirst({
              filters: { email: `tiktok_${providerId}@noreply.tiktok` },
            });
        }

        if (user) {
          // Existing user — just link them
          if (user.blocked) {
            return ctx.badRequest("Your account has been blocked");
          }
        } else {
          // Truly new user
          isNewUser = true;

          const defaultRole = await strapi
            .documents("plugin::users-permissions.role")
            .findFirst({ filters: { type: "authenticated" } });

          const username = await findUniqueUsername(
            strapi,
            displayName || `${provider}_${providerId.slice(0, 8)}`,
          );

          user = await strapi
            .documents("plugin::users-permissions.user")
            .create({
              data: {
                username,
                email: userEmail,
                provider,
                confirmed: true,
                role: defaultRole?.documentId,
              } as any,
            });
        }

        // Create social-account record linked to user
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

    async meFind(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      const filters: any = { user: { id: user.id } };
      if (ctx.query.provider) {
        filters.provider = ctx.query.provider;
      }

      const socialAccounts = await strapi
        .documents("api::social-account.social-account")
        .findMany({ filters });

      return { data: socialAccounts };
    },

    async meCreate(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      const data = ctx.request.body.data || {};

      // Check if user already has this provider linked
      const existing = await strapi
        .documents("api::social-account.social-account")
        .findFirst({
          filters: { user: { id: user.id }, provider: data.provider },
        });

      if (existing) {
        return ctx.badRequest(
          `You already have a ${data.provider} account linked`,
        );
      }

      const socialAccount = await strapi
        .documents("api::social-account.social-account")
        .create({
          data: {
            ...data,
            user: { connect: [user.documentId] },
          },
        });

      return { data: socialAccount };
    },

    async meUpdate(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      const { id } = ctx.params;

      const socialAccount = await strapi
        .documents("api::social-account.social-account")
        .findOne({
          documentId: id,
          populate: { user: { fields: ["id"] } },
        });

      if (!socialAccount) {
        return ctx.notFound();
      }

      if (socialAccount.user?.id !== user.id) {
        return ctx.forbidden("You can only update your own social account");
      }

      return super.update(ctx);
    },

    async meDelete(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized();
      }

      const { id } = ctx.params;

      const socialAccount = await strapi
        .documents("api::social-account.social-account")
        .findOne({
          documentId: id,
          populate: { user: { fields: ["id"] } },
        });

      if (!socialAccount) {
        return ctx.notFound();
      }

      if (socialAccount.user?.id !== user.id) {
        return ctx.forbidden("You can only delete your own social account");
      }

      await strapi
        .documents("api::social-account.social-account")
        .delete({ documentId: id });

      return { data: { documentId: id } };
    },
  }),
);
