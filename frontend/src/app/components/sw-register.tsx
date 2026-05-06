"use client";

import { useEffect } from "react";

// Registers /sw.js with scope "/" on the client. Mount once at the root
// layout. The SW only handles Web Push events (no precaching, no offline).
//
// Migration: earlier deploys registered the SW with default scope of
// /serwist/, which only controlled /serwist/* pages. Push events worked
// but `serviceWorker.ready` hangs on any other page, breaking the
// notification toggle UI. This effect detects any old-scope registration
// and unregisters it before registering fresh with scope "/", so users
// transition silently without action on their part.
export function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    (async () => {
      try {
        const origin = window.location.origin;
        const registrations = await navigator.serviceWorker.getRegistrations();

        // Drop any registration whose scope isn't site-root. Includes the
        // legacy /serwist/ scope and any old self-uninstaller leftovers.
        for (const reg of registrations) {
          if (reg.scope !== `${origin}/`) {
            await reg.unregister();
          }
        }

        // Make sure there's a registration at scope "/". Re-registering
        // an identical SW is a no-op for the browser, so this is safe to
        // run on every load.
        await navigator.serviceWorker.register("/serwist/sw.js", { scope: "/" });
      } catch {
        // best-effort; rest of the app keeps working without push
      }
    })();
  }, []);

  return null;
}
