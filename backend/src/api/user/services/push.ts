// Web Push fan-out helpers. Used both by the n8n "streamer live" webhook
// and by any future server-triggered notification flow.
//
// Design notes:
//   - Sends with global concurrency cap (not per-streamer batches) so a
//     bulk webhook with 100 streamers can't blow up the outbound socket
//     count, and a streamer with thousands of followers can't starve
//     smaller streamers' pushes.
//   - Reactively clears subscriptions that the push service rejects with
//     404 (gone) or 410 (expired). Cleanup is batched into a single
//     UPDATE at the end so we don't fire one DB write per dead endpoint.
//   - Returns a summary so callers can log/observe.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const webpush = require("web-push");

const PUSH_CONCURRENCY = 100;

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
}

interface UserWithSubscription {
  id: number;
  documentId: string;
  pushSubscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  } | null;
}

export async function sendPushToUsers(
  users: UserWithSubscription[],
  payload: PushPayload,
): Promise<{ sent: number; failed: number; removed: number }> {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject =
    process.env.VAPID_SUBJECT || "mailto:contact@livestreamrecorder.com";

  if (!publicKey || !privateKey) {
    strapi.log.error("[push] VAPID keys not configured");
    return { sent: 0, failed: 0, removed: 0 };
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const body = JSON.stringify(payload);

  // Knex sometimes hands back jsonb columns as strings depending on the
  // pg type-parser config — accept both forms here.
  function normalizeSub(sub: unknown): UserWithSubscription["pushSubscription"] {
    if (!sub) return null;
    if (typeof sub === "string") {
      try {
        return JSON.parse(sub);
      } catch {
        return null;
      }
    }
    return sub as UserWithSubscription["pushSubscription"];
  }

  const subscribed = users
    .map((u) => ({ ...u, pushSubscription: normalizeSub(u.pushSubscription) }))
    .filter((u) => u.pushSubscription?.endpoint);

  if (users.length && !subscribed.length) {
    strapi.log.warn(
      `[push] all ${users.length} candidates filtered out — sample raw subscription type=${typeof users[0]?.pushSubscription} value=${JSON.stringify(users[0]?.pushSubscription).slice(0, 100)}`,
    );
  }

  let sent = 0;
  let failed = 0;
  const deadUserIds: number[] = [];

  // Cap in-flight push requests so a 5,000-follower streamer doesn't
  // open 5,000 simultaneous outbound HTTPS connections.
  let cursor = 0;
  async function worker() {
    while (cursor < subscribed.length) {
      const i = cursor++;
      const user = subscribed[i];
      try {
        await webpush.sendNotification(user.pushSubscription, body);
        sent++;
      } catch (err: any) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          deadUserIds.push(user.id);
        } else {
          failed++;
          strapi.log.warn(
            `[push] send failed user=${user.id} status=${err?.statusCode} body=${err?.body || err?.message}`,
          );
        }
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(PUSH_CONCURRENCY, subscribed.length) }, () =>
      worker(),
    ),
  );

  // Batched cleanup of dead subscriptions — single SQL UPDATE instead of
  // one round trip per stale endpoint.
  if (deadUserIds.length) {
    try {
      await strapi.db.connection
        .raw(`UPDATE up_users SET push_subscription = NULL WHERE id = ANY(?)`, [
          deadUserIds,
        ]);
    } catch (clearErr) {
      strapi.log.warn(
        `[push] failed batched dead-sub cleanup (${deadUserIds.length} users)`,
        clearErr,
      );
    }
  }

  const removed = deadUserIds.length;
  strapi.log.info(
    `[push] fan-out complete: sent=${sent} failed=${failed} removed=${removed} (of ${users.length} candidates)`,
  );
  return { sent, failed, removed };
}

interface UserWithPayload {
  id: number;
  documentId: string;
  pushSubscription: UserWithSubscription["pushSubscription"];
  payload: PushPayload;
}

// Same fan-out machinery as sendPushToUsers but each user has its own
// payload — used for locale-aware notifications and the "N streamers are
// live" merge where each recipient sees a different list.
export async function sendPushPerUser(
  items: UserWithPayload[],
): Promise<{ sent: number; failed: number; removed: number }> {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject =
    process.env.VAPID_SUBJECT || "mailto:contact@livestreamrecorder.com";

  if (!publicKey || !privateKey) {
    strapi.log.error("[push] VAPID keys not configured");
    return { sent: 0, failed: 0, removed: 0 };
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  function normalizeSub(
    sub: unknown,
  ): UserWithSubscription["pushSubscription"] {
    if (!sub) return null;
    if (typeof sub === "string") {
      try {
        return JSON.parse(sub);
      } catch {
        return null;
      }
    }
    return sub as UserWithSubscription["pushSubscription"];
  }

  const subscribed = items
    .map((it) => ({
      ...it,
      pushSubscription: normalizeSub(it.pushSubscription),
    }))
    .filter((it) => it.pushSubscription?.endpoint);

  let sent = 0;
  let failed = 0;
  const deadUserIds: number[] = [];

  let cursor = 0;
  async function worker() {
    while (cursor < subscribed.length) {
      const i = cursor++;
      const it = subscribed[i];
      try {
        await webpush.sendNotification(
          it.pushSubscription,
          JSON.stringify(it.payload),
        );
        sent++;
      } catch (err: any) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          deadUserIds.push(it.id);
        } else {
          failed++;
          strapi.log.warn(
            `[push] send failed user=${it.id} status=${err?.statusCode} body=${err?.body || err?.message}`,
          );
        }
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(PUSH_CONCURRENCY, subscribed.length) }, () =>
      worker(),
    ),
  );

  if (deadUserIds.length) {
    try {
      await strapi.db.connection.raw(
        `UPDATE up_users SET push_subscription = NULL WHERE id = ANY(?)`,
        [deadUserIds],
      );
    } catch (clearErr) {
      strapi.log.warn(
        `[push] failed batched dead-sub cleanup (${deadUserIds.length} users)`,
        clearErr,
      );
    }
  }

  const removed = deadUserIds.length;
  return { sent, failed, removed };
}
