/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Service worker — exists for Web Push notifications only. We do NOT
// precache anything; pages always come from network/CF.
//
// Lifecycle notes:
//   - On install we drop any caches lingering from the old Serwist setup
//     so we don't ship stale HTML to legacy users.
//   - skipWaiting + clients.claim makes the new SW take over immediately,
//     so a deploy that bumps this file actually replaces the old SW on
//     the next visit instead of waiting for all tabs to close.

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", (event) => {
  sw.skipWaiting();
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    })(),
  );
});

sw.addEventListener("activate", (event) => {
  event.waitUntil(sw.clients.claim());
});

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

sw.addEventListener("push", (event) => {
  console.log("[sw] push event received, hasData=", !!event.data);
  if (!event.data) {
    console.warn("[sw] push event with no data");
    return;
  }

  let payload: PushPayload;
  try {
    payload = event.data.json();
    console.log("[sw] push payload:", payload);
  } catch (err) {
    console.warn("[sw] push payload not JSON, using text", err);
    payload = { title: "Live Stream Recorder", body: event.data.text() };
  }

  event.waitUntil(
    sw.registration
      .showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon ?? "/icons/icon-192.png",
        badge: payload.badge ?? "/icons/icon-192.png",
        tag: payload.tag,
        data: { url: payload.url ?? "/" },
      })
      .then(() => console.log("[sw] showNotification done"))
      .catch((err) => console.error("[sw] showNotification failed", err)),
  );
});

sw.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string } | null)?.url ?? "/";
  event.waitUntil(
    (async () => {
      // Re-use an existing tab on the same origin if one is open, otherwise
      // open a new one. Avoids spawning duplicate tabs every time a push
      // arrives while the site is already open.
      const clients = await sw.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of clients) {
        if (client.url.startsWith(sw.registration.scope)) {
          await client.focus();
          if ("navigate" in client) {
            await client.navigate(url);
          }
          return;
        }
      }
      await sw.clients.openWindow(url);
    })(),
  );
});

// Browser auto-rotates the subscription occasionally. When that happens,
// re-subscribe with the same VAPID key and POST the new sub to the server
// so we don't keep sending to a dead endpoint.
sw.addEventListener("pushsubscriptionchange", (event: any) => {
  event.waitUntil(
    (async () => {
      try {
        const sub = await sw.registration.pushManager.subscribe(
          event.oldSubscription?.options ?? {
            userVisibleOnly: true,
          },
        );
        await fetch("/api/sw-resubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sub.toJSON()),
        });
      } catch {
        // best-effort; user can re-enable from settings if this fails
      }
    })(),
  );
});
