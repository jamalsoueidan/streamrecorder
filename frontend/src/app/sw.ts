/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// PWA removal: this SW exists ONLY to evict itself from any browser that
// still has the old Serwist-based service worker installed. Once a client
// loads this version, the SW unregisters, drops every cache it owns, and
// triggers a one-time reload so the page renders straight from network
// going forward.
//
// Keep this file shipped (do NOT delete) for at least a few weeks until
// you're confident the long tail of installed PWAs has updated. After
// that, the route handler can be removed too.

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", () => {
  sw.skipWaiting();
});

sw.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      await sw.registration.unregister();
      const clients = await sw.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })(),
  );
});
