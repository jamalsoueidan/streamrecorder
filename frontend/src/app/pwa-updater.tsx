// pwa-updater.tsx
"use client";

import { Button, Notification } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function PWAUpdater() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      // Check every hour for updates
      setInterval(() => registration.update(), 60 * 60 * 1000);

      // If there's already a waiting worker on load
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowUpdate(true);
      }

      // Listen for new workers
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setWaitingWorker(newWorker);
            setShowUpdate(true);
          }
        });
      });
    });

    // Reload when the new SW takes over
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage("SKIP_WAITING");
    }
  };

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
      <Button size="xs" ml="md" onClick={handleUpdate}>
        Update Now
      </Button>
    </Notification>
  );
}
