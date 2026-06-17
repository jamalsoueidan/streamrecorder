import { routing } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

/**
 * Generate alternates object for metadata with canonical and hreflang tags.
 * Always emits trailing-slash-FREE URLs to match Next.js default routing
 * (no trailingSlash in next.config). A canonical of `/it/` would be 308'd
 * to `/it` by Next, creating an infinite loop and getting the page dropped
 * from Google's index.
 *
 * @param path - The path without locale prefix (e.g., "/recordings/tiktok"
 *               or "/" for the home page).
 * @param currentLocale - The current locale (defaults to "en")
 */
export function generateAlternates(path: string, currentLocale: string = "en") {
  // Normalize: leading slash, no trailing slash. Root "/" becomes "" so
  // that `${baseUrl}/${locale}${normalizedPath}` produces `/it` instead
  // of `/it/`.
  const ensured = path.startsWith("/") ? path : `/${path}`;
  const normalizedPath = ensured === "/" ? "" : ensured.replace(/\/+$/, "");

  // Build languages object
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    if (locale === "en") {
      // English uses no prefix (localePrefix: "as-needed"). Empty
      // normalizedPath here means the home page → `${baseUrl}`.
      languages[locale] = `${baseUrl}${normalizedPath}`;
    } else {
      languages[locale] = `${baseUrl}/${locale}${normalizedPath}`;
    }
  }

  // x-default points to English version
  languages["x-default"] = `${baseUrl}${normalizedPath}`;

  // Canonical URL for current locale
  const canonical =
    currentLocale === "en"
      ? `${baseUrl}${normalizedPath}`
      : `${baseUrl}/${currentLocale}${normalizedPath}`;

  return {
    canonical,
    languages,
  };
}
