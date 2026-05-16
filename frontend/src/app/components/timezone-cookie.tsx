"use client";

import { useEffect } from "react";

// Captures the browser's IANA timezone into a `tz` cookie so the server
// can format dates in the user's local TZ during SSR. The TZ also drives
// the hour-cycle preference server-side (location-based: Turkey → 24h,
// US → 12h), since the browser's resolved hourCycle reflects the OS
// locale, not the user's physical country.
export function TimezoneCookie() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;

    const existing = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tz="))
      ?.split("=")[1];
    if (existing === tz) return;

    document.cookie = `tz=${tz}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    // First-time set: reload once so the next SSR pass uses the cookie.
    if (!existing) location.reload();
  }, []);

  return null;
}
