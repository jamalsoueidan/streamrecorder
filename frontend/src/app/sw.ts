/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: [
    // Static assets - cache first (images, fonts, styles)
    {
      matcher: ({ request }) =>
        request.destination === "image" ||
        request.destination === "font" ||
        request.destination === "style",
      handler: new CacheFirst({
        cacheName: "static-assets",
      }),
    },
  ],
});

// Force reload all clients when new SW activates
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Claim clients first so they're controlled by this SW
      await self.clients.claim();

      // includeUncontrolled ensures we find windows even if claim() is still propagating
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clients) {
        if (client.url && "navigate" in client) {
          try {
            await (client as WindowClient).navigate(client.url);
          } catch {
            // Navigation can fail (e.g., client not in navigable state)
            // Continue with other clients
          }
        }
      }
    })()
  );
});

serwist.addEventListeners();
