// Server-side helper for resolving the user's preferred hour cycle from
// their IANA timezone. Kept out of the client-tagged `hour-cycle.tsx` so
// server components (like /my/layout.tsx) can import it without dragging
// in `"use client"` directives. Pulls in the `countries-and-timezones`
// runtime — don't import this file from anywhere just for the
// `HourCycle` type alone.
import { getTimezone } from "countries-and-timezones";

export type HourCycle = "h11" | "h12" | "h23" | "h24";

// Per ECMA-402, `Intl.DateTimeFormat(...).resolvedOptions().hourCycle`
// is always one of the four allowed strings when `hour` was requested,
// so this is just a typesafe narrowing — no defaulting that could mask
// a real fallback elsewhere.
function asHourCycle(hc: string | undefined): HourCycle | null {
  return hc === "h11" || hc === "h12" || hc === "h23" || hc === "h24"
    ? hc
    : null;
}

function localeHourCycle(locale: string): HourCycle {
  const resolved = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
  }).resolvedOptions().hourCycle;
  // Final ultimate fallback when Intl can't tell us anything — h23 is the
  // global majority. In practice never hit since every shipped locale has
  // a defined hourCycle for `hour: numeric`.
  return asHourCycle(resolved) ?? "h23";
}

// Derive the user's hour cycle from their IANA timezone:
//   1. IANA zone → ISO country code (via `countries-and-timezones`,
//      which embeds CLDR's tz → country mapping).
//   2. country → that country's native locale via
//      `Intl.Locale("und", { region }).maximize()` (CLDR likelySubtags).
//   3. native locale → Intl's default hourCycle for that locale.
// So `Europe/Istanbul` -> `TR` -> `tr-Latn-TR` -> "h23",
//    `America/New_York` -> `US` -> `en-Latn-US` -> "h12",
//    `America/Mexico_City` -> `MX` -> `es-Latn-MX` -> "h23".
// If the zone can't be mapped (rare — aliased or new zone not in the
// `countries-and-timezones` data), fall back to the UI locale's actual
// resolved default (e.g. en → h12), so en-US users with an obscure zone
// don't silently flip to 24h.
export function hourCycleFromTimeZone(
  tz: string,
  fallbackLocale: string,
): HourCycle {
  const country = getTimezone(tz)?.countries[0];
  if (!country) return localeHourCycle(fallbackLocale);

  const nativeLocale = new Intl.Locale("und", { region: country })
    .maximize()
    .toString();
  return localeHourCycle(nativeLocale);
}
