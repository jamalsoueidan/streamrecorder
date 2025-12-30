self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim()); // Take control immediately
});
