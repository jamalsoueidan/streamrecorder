"use client";

import { useEffect } from "react";

export function PWAUpdater() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      setInterval(() => registration.update(), 60 * 60 * 1000);
    });

    // Reload automatically when new SW takes control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, []);

  return <></>;
}
