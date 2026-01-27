"use client";

import { useEffect } from "react";

export const isBot =
  /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot/i;

export function PWAUpdater() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (isBot.test(navigator.userAgent)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        setInterval(() => registration.update(), 60 * 60 * 1000);
      })
      .catch(() => {});

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, []);

  return null;
}
