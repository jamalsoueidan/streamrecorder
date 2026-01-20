"use client";

import { useEffect } from "react";

export function PWAUpdater() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (/bot|crawl|spider|googlebot/i.test(navigator.userAgent)) return;

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
