// Pure type + helpers — kept out of the client-tagged `hour-cycle.tsx`
// so server components (like /my/layout.tsx) can import them.
import { getTimezone } from "countries-and-timezones";

export type HourCycle = "h11" | "h12" | "h23" | "h24";

function normalizeHourCycle(hc: string | undefined): HourCycle {
  return hc === "h11" || hc === "h12" || hc === "h24" ? hc : "h23";
}

// Derive the user's hour cycle from their IANA timezone, fully driven by
// Intl + IANA + CLDR data:
//   1. IANA zone → ISO country code (via `countries-and-timezones`,
//      which embeds CLDR's tz → country mapping).
//   2. country → that country's native locale via
//      `Intl.Locale("und", { region }).maximize()` (CLDR likelySubtags).
//   3. native locale → Intl's default hourCycle for that locale.
// So `Europe/Istanbul` -> `TR` -> `tr-Latn-TR` -> "h23",
//    `America/New_York` -> `US` -> `en-Latn-US` -> "h12",
//    `America/Mexico_City` -> `MX` -> `es-Latn-MX` -> "h23".
// If the zone can't be mapped (rare — aliased or new zone not in the
// `countries-and-timezones` data), fall back to the UI locale's default
// instead of hardcoding h23 — that way en-US users with an obscure zone
// don't silently flip from 12h to 24h.
export function hourCycleFromTimeZone(
  tz: string,
  fallbackLocale: string,
): HourCycle {
  const country = getTimezone(tz)?.countries[0];
  if (!country) {
    return normalizeHourCycle(
      new Intl.DateTimeFormat(fallbackLocale, { hour: "numeric" })
        .resolvedOptions().hourCycle,
    );
  }

  const nativeLocale = new Intl.Locale("und", { region: country })
    .maximize()
    .toString();
  return normalizeHourCycle(
    new Intl.DateTimeFormat(nativeLocale, { hour: "numeric" })
      .resolvedOptions().hourCycle,
  );
}
