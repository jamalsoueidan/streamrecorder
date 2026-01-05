self.addEventListener("install", (event) => {
  // empty - just acknowledging the event
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim()); // "take control of all tabs now"
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting(); // "activate immediately, don't wait"
  }
});
