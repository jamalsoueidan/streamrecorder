// app/components/pwa-updater.tsx
"use client";

import { Button, Notification } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function PWAUpdater() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        setInterval(() => registration.update(), 60 * 60 * 1000);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setShowUpdate(true);
            }
          });
        });
      });
    }
  }, []);

  if (!showUpdate) return null;

  return (
    <Notification
      title="Update Available"
      icon={<IconRefresh size={18} />}
      onClose={() => setShowUpdate(false)}
      style={{
        position: "fixed",
        bottom: 80,
        left: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      A new version is available.
      <Button size="xs" ml="md" onClick={() => window.location.reload()}>
        Update Now
      </Button>
    </Notification>
  );
}
