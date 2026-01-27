"use client";

import { isbot } from "isbot";
import { useEffect } from "react";

export function PWAUpdater() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (isbot(navigator.userAgent)) return;

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
