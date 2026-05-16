"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Captures the browser's IANA timezone into a `tz` cookie so /my/'s
// layout can format dates in the user's local zone. The TZ also drives
// the hour-cycle preference server-side (location-based: Turkey → 24h,
// US → 12h), since the browser's resolved hourCycle reflects the OS
// locale, not the user's physical country.
//
// Scoped to `path=/my`: the cookie is only sent on /my/ requests, so it
// can never reach public routes and can't accidentally pollute the CF
// cache key for cacheable pages. `Secure` is enabled in production HTTPS.
export function TimezoneCookie() {
  const router = useRouter();

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;

    const existing = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tz="))
      ?.split("=")[1];
    if (existing === tz) return;

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      `tz=${tz}; path=/my; max-age=${60 * 60 * 24 * 365}; SameSite=Lax${secure}`;

    // Only re-fetch server components if the new TZ would actually change
    // the rendered output. UTC == server default, so nothing to refresh.
    // `router.refresh()` re-runs the RSC tree without a full page reload
    // so there's no white-flash like `location.reload()`.
    if (!existing && tz !== "UTC") {
      router.refresh();
    }
  }, [router]);

  return null;
}
