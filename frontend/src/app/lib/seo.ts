import { routing } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

/**
 * Generate alternates object for metadata with canonical and hreflang tags
 * @param path - The path without locale prefix (e.g., "/recordings/tiktok")
 * @param currentLocale - The current locale (defaults to "en")
 */
export function generateAlternates(path: string, currentLocale: string = "en") {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Build languages object
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    if (locale === "en") {
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
