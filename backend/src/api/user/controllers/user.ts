export default {
  async update(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    const { username } = ctx.request.body;

    if (!username || typeof username !== "string") {
      return ctx.badRequest("Username is required");
    }

    const trimmed = username.trim();

    if (trimmed.length < 3 || trimmed.length > 30) {
      return ctx.badRequest("Username must be between 3 and 30 characters");
    }

    // Check if username is already taken by another user
    const existing = await strapi
      .documents("plugin::users-permissions.user")
      .findFirst({
        filters: {
          username: { $eqi: trimmed },
          documentId: { $ne: user.documentId },
        },
      });

    if (existing) {
      return ctx.badRequest("Username is already taken");
    }

    // Update the user
    const updated = await strapi
      .documents("plugin::users-permissions.user")
      .update({
        documentId: user.documentId,
        data: { username: trimmed },
      });

    return {
      data: {
        id: updated.id,
        documentId: updated.documentId,
        username: updated.username,
        email: updated.email,
      },
    };
  },

  async setPushSubscription(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    const subscription = ctx.request.body;

    // Web Push subscriptions look like
    //   { endpoint: "...", keys: { p256dh: "...", auth: "..." } }
    // We need all three fields to encrypt+send a push, so reject anything
    // missing the basics rather than storing a useless object.
    if (
      !subscription ||
      typeof subscription !== "object" ||
      typeof subscription.endpoint !== "string" ||
      !subscription.keys ||
      typeof subscription.keys.p256dh !== "string" ||
      typeof subscription.keys.auth !== "string"
    ) {
      return ctx.badRequest("Invalid push subscription");
    }

    await strapi.documents("plugin::users-permissions.user").update({
      documentId: user.documentId,
      data: { pushSubscription: subscription },
    });

    return { success: true };
  },

  async deletePushSubscription(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    await strapi.documents("plugin::users-permissions.user").update({
      documentId: user.documentId,
      data: { pushSubscription: null },
    });

    return { success: true };
  },

  async testPushNotification(ctx) {
    strapi.log.info("[test-push] start");
    const user = ctx.state.user;
    if (!user) {
      strapi.log.warn("[test-push] no user in ctx.state");
      return ctx.unauthorized("You must be logged in");
    }
    strapi.log.info(`[test-push] user.id=${user.id}`);

    // pushSubscription is `private` on the schema so the Document Service
    // strips it on read. Drop down to the lower-level db.query which keeps
    // all columns.
    const fresh = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { id: user.id } });

    const subscription = (fresh as any)?.pushSubscription;
    strapi.log.info(
      `[test-push] user=${user.id} hasSubscription=${!!subscription}`,
    );

    if (!subscription || !subscription.endpoint) {
      return ctx.badRequest("No push subscription saved for this user");
    }

    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject =
      process.env.VAPID_SUBJECT || "mailto:contact@livestreamrecorder.com";
    strapi.log.info(
      `[test-push] vapid publicLen=${publicKey?.length || 0} privateLen=${privateKey?.length || 0}`,
    );
    if (!publicKey || !privateKey) {
      strapi.log.error("[test-push] VAPID keys missing in env");
      return ctx.internalServerError("VAPID keys not configured");
    }

    let webpush: typeof import("web-push");
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      webpush = require("web-push");
    } catch (e: any) {
      strapi.log.error("[test-push] failed to load web-push module", e);
      return ctx.internalServerError("web-push module not installed");
    }
    webpush.setVapidDetails(subject, publicKey, privateKey);
    strapi.log.info(
      `[test-push] sending to endpoint=${subscription.endpoint.slice(0, 80)}...`,
    );

    try {
      // Use a unique tag per test so macOS treats each click as a fresh
      // banner instead of silently updating the previous one.
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "Test notification",
          body: `If you see this, push works. (${new Date().toLocaleTimeString()})`,
          url: "/my/settings",
          tag: `test-push-${Date.now()}`,
        }),
      );
      strapi.log.info("[test-push] sent OK");
      return { success: true };
    } catch (err: any) {
      strapi.log.error(
        `[test-push] send failed status=${err?.statusCode} body=${err?.body} message=${err?.message}`,
      );
      strapi.log.error(err?.stack || String(err));
      // Subscription expired/revoked → clear it so we don't keep failing.
      if (err?.statusCode === 404 || err?.statusCode === 410) {
        await strapi.documents("plugin::users-permissions.user").update({
          documentId: user.documentId,
          data: { pushSubscription: null },
        });
        return ctx.badRequest("Subscription expired, please re-enable");
      }
      return ctx.internalServerError(
        err?.body || err?.message || "Push send failed",
      );
    }
  },

  async destroy(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    // Delete social accounts linked to this user
    const socialAccounts = await strapi
      .documents("api::social-account.social-account")
      .findMany({
        filters: { user: { documentId: user.documentId } },
      });

    for (const account of socialAccounts) {
      await strapi
        .documents("api::social-account.social-account")
        .delete({ documentId: account.documentId });
    }

    // Delete the user
    await strapi.documents("plugin::users-permissions.user").delete({
      documentId: user.documentId,
    });

    return { success: true };
  },
};
