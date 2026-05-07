import { sendPushPerUser } from "../services/push";
import { getStrings, localizeUrl } from "../services/push-strings";

interface LiveItem {
  username: string;
  type: string;
}

// Background worker for /user/notify-streamers-live. Three knex queries
// (followers lookup, dedup, subscribers), then concurrency-capped push
// fan-out. No per-streamer round trips.
async function processStreamersLive(items: LiveItem[]) {
  const startedAt = Date.now();
  const knex = strapi.db.connection;

  // Build the (username, type) tuple list once. We'll use it twice:
  // for the lookup query and to map results back to incoming items.
  const usernameLower = items.map((i) => i.username.toLowerCase());
  const typeSet = Array.from(new Set(items.map((i) => i.type)));

  // Step 1 — resolve (username, type) → follower.id. Username comparison
  // is case-insensitive to match usernameOrFilter behaviour. Restrict to
  // the small set of types we received so the index can be used.
  // Followers have i18n on (one row per locale, same document_id) — pin
  // to locale=en so we don't return duplicate IDs and overwrite the map.
  const followers: Array<{ id: number; username: string; type: string }> =
    await knex("followers")
      .select("id", "username", "type")
      .whereIn("type", typeSet)
      .where("locale", "en")
      .whereRaw("LOWER(username) = ANY(?)", [usernameLower]);

  if (!followers.length) {
    strapi.log.info("[notify] no matching followers found");
    return;
  }

  const followerIds = followers.map((f) => f.id);
  // Two-key map: type + lowercased username → id (avoid collisions
  // across platforms with the same username).
  const idByKey = new Map<string, number>(
    followers.map((f) => [`${f.type}::${f.username.toLowerCase()}`, f.id]),
  );
  const itemByFollowerId = new Map<number, LiveItem>();
  for (const it of items) {
    const id = idByKey.get(`${it.type}::${it.username.toLowerCase()}`);
    if (id) itemByFollowerId.set(id, it);
  }

  // Step 2 — subscribers first. If zero users with push enabled follow
  // any of these streamers, we can bail before touching the sources table.
  // Common in early rollout when only a handful of users have opted in.
  const subRows: Array<{
    follower_id: number;
    user_id: number;
    document_id: string;
    push_subscription: any;
  }> = await knex("up_users_followers_lnk as ufl")
    .select(
      "ufl.follower_id",
      "u.id as user_id",
      "u.document_id",
      "u.push_subscription",
    )
    .join("up_users as u", "u.id", "ufl.user_id")
    .whereIn("ufl.follower_id", followerIds)
    .whereNotNull("u.push_subscription");

  if (!subRows.length) {
    strapi.log.info(
      `[notify] no subscribers for any of ${followerIds.length} live streamers, skipping`,
    );
    return;
  }

  // Step 3 — dedup, but only on followers that actually have subscribers.
  // Followers with any source in the last 1h are mid-session; skip them.
  const followersWithSubs = Array.from(
    new Set(subRows.map((r) => r.follower_id)),
  );
  const recent: Array<{ follower_id: number }> = await knex("sources as s")
    .distinct("rfl.follower_id")
    .join("sources_recording_lnk as srl", "srl.source_id", "s.id")
    .join("recordings_follower_lnk as rfl", "rfl.recording_id", "srl.recording_id")
    .whereIn("rfl.follower_id", followersWithSubs)
    .where("s.created_at", ">", knex.raw("NOW() - INTERVAL '1 hour'"));

  const recentSet = new Set(recent.map((r) => r.follower_id));
  const eligibleFollowerIds = followersWithSubs.filter(
    (id) => !recentSet.has(id),
  );

  if (!eligibleFollowerIds.length) {
    strapi.log.info(
      `[notify] all ${followersWithSubs.length} subscribed streamers were mid-session, skipping`,
    );
    return;
  }

  // Group by user so we can merge multiple newly-live streamers a user
  // follows into a single push (avoids the OS coalescing rapid same-origin
  // notifications and silently dropping some). Also lets us pull the
  // user's locale once per recipient.
  interface PerUserBucket {
    documentId: string;
    pushSubscription: any;
    locale: string | undefined;
    items: LiveItem[];
  }
  const byUser = new Map<number, PerUserBucket>();

  for (const r of subRows) {
    const item = itemByFollowerId.get(r.follower_id);
    if (!item) continue;
    if (!eligibleFollowerIds.includes(r.follower_id)) continue;

    let bucket = byUser.get(r.user_id);
    if (!bucket) {
      // pushSubscription is jsonb — knex may hand it back as string or
      // object depending on pg type-parser config. Normalise once here so
      // we can read .locale safely.
      let sub = r.push_subscription;
      if (typeof sub === "string") {
        try {
          sub = JSON.parse(sub);
        } catch {
          sub = null;
        }
      }
      bucket = {
        documentId: r.document_id,
        pushSubscription: sub,
        locale: sub?.locale,
        items: [],
      };
      byUser.set(r.user_id, bucket);
    }
    bucket.items.push(item);
  }

  // Step 4 — build per-user payloads (single vs merged) in the user's
  // locale, then fan out with the concurrency-capped sender.
  const pushItems: Array<{
    id: number;
    documentId: string;
    pushSubscription: any;
    payload: {
      title: string;
      body: string;
      url?: string;
      tag?: string;
      icon?: string;
    };
  }> = [];

  for (const [userId, bucket] of byUser) {
    if (!bucket.items.length) continue;
    const strings = getStrings(bucket.locale);

    if (bucket.items.length === 1) {
      const it = bucket.items[0];
      const { title, body } = strings.single(it.username, it.type);
      pushItems.push({
        id: userId,
        documentId: bucket.documentId,
        pushSubscription: bucket.pushSubscription,
        payload: {
          title,
          body,
          url: localizeUrl(bucket.locale, `/my/${it.type}/${it.username}`),
          tag: `live-${it.type}-${it.username}`,
        },
      });
    } else {
      const { title, body } = strings.multi(bucket.items.length);
      pushItems.push({
        id: userId,
        documentId: bucket.documentId,
        pushSubscription: bucket.pushSubscription,
        payload: {
          title,
          body,
          url: localizeUrl(bucket.locale, `/my/live`),
          // Per-user batch tag so a follow-up batch replaces the previous
          // banner for the same user instead of stacking.
          tag: `live-batch-${userId}`,
        },
      });
    }
  }

  const result = await sendPushPerUser(pushItems);

  const dur = Date.now() - startedAt;
  strapi.log.info(
    `[notify] done in ${dur}ms — recipients=${pushItems.length} (streamers=${eligibleFollowerIds.length}/${items.length}) sent=${result.sent} failed=${result.failed} dead=${result.removed}`,
  );
}

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

    // Optional locale — used by the live-fan-out to render the push title
    // in the user's language. Whitelist to the locales we actually have
    // strings for, otherwise we just store no locale and fall back to en.
    const ALLOWED_LOCALES = ["en", "ar", "tr", "ko", "ja", "es", "pt", "id"];
    const locale =
      typeof subscription.locale === "string" &&
      ALLOWED_LOCALES.includes(subscription.locale)
        ? subscription.locale
        : undefined;

    const toStore: Record<string, any> = {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    };
    if (locale) toStore.locale = locale;

    await strapi.documents("plugin::users-permissions.user").update({
      documentId: user.documentId,
      data: { pushSubscription: toStore },
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

  // n8n calls this once per check-cycle with the list of streamers it
  // just confirmed to be live. We dedup against recent recordings (so a
  // brief offline-online flicker doesn't double-notify) and fan out
  // pushes to everyone following each remaining streamer.
  //
  // Designed for a single bulk request with up to ~100 streamers, with
  // up to thousands of total subscribers across them. Two SQL queries
  // total + concurrency-capped HTTP fan-out keep the load bounded.
  async notifyStreamersLive(ctx) {
    const items = Array.isArray(ctx.request.body) ? ctx.request.body : null;
    if (!items?.length) {
      return ctx.badRequest("Body must be a non-empty array of streamers");
    }

    // Validate each entry has the fields we need. Reject the whole call
    // if anything is malformed — n8n should send clean data.
    for (const it of items) {
      if (
        !it ||
        typeof it.username !== "string" ||
        typeof it.type !== "string"
      ) {
        return ctx.badRequest("Each item needs username and type");
      }
    }

    // Respond fast — let n8n move on. Real work runs in the background.
    ctx.status = 202;
    ctx.body = { accepted: items.length };

    setImmediate(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      processStreamersLive(items).catch((err) =>
        strapi.log.error("[notify] background processing crashed", err),
      );
    });
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
