import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import arLocale from "i18n-iso-countries/langs/ar.json";

// Register locales
countries.registerLocale(enLocale);
countries.registerLocale(arLocale);

/**
 * Normalizes a string for URL-safe slugs
 * - Removes diacritics (ü → u, é → e, etc.)
 * - Removes commas and other special characters
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 */
function normalizeForSlug(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .replace(/,/g, "") // Remove commas
    .replace(/[^a-z0-9\s-]/g, "") // Remove other special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, ""); // Trim hyphens from ends
}

/**
 * Converts a country slug (e.g., "morocco", "united-states") to ISO country code (e.g., "MA", "US")
 */
export function countrySlugToCode(slug: string, locale: string = "en"): string | null {
  const normalizedSlug = normalizeForSlug(slug);

  // If slug is already a valid 2-letter code, return it
  if (slug.length === 2 && countries.isValid(slug.toUpperCase())) {
    return slug.toUpperCase();
  }

  // Get all country codes and find a match by comparing normalized names
  const allCodes = Object.keys(countries.getAlpha2Codes());

  for (const code of allCodes) {
    const name = countries.getName(code, locale);
    if (name && normalizeForSlug(name) === normalizedSlug) {
      return code;
    }
  }

  // Try English as fallback if locale is different
  if (locale !== "en") {
    for (const code of allCodes) {
      const name = countries.getName(code, "en");
      if (name && normalizeForSlug(name) === normalizedSlug) {
        return code;
      }
    }
  }

  return null;
}

/**
 * Converts an ISO country code to a URL-friendly slug
 */
export function countryCodeToSlug(code: string, locale: string = "en"): string {
  const name = countries.getName(code.toUpperCase(), locale);
  if (name) {
    return normalizeForSlug(name);
  }
  return code.toLowerCase();
}

/**
 * Gets the country name from a code or slug
 */
export function getCountryName(codeOrSlug: string, locale: string = "en"): string {
  // If it's a 2-letter code
  if (codeOrSlug.length === 2 && countries.isValid(codeOrSlug.toUpperCase())) {
    return countries.getName(codeOrSlug.toUpperCase(), locale) || codeOrSlug;
  }

  // If it's a slug, convert to code first then get name
  const code = countrySlugToCode(codeOrSlug, locale);
  if (code) {
    return countries.getName(code, locale) || codeOrSlug;
  }

  // Return the slug with proper casing as fallback
  return codeOrSlug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get all country codes
 */
export function getAllCountryCodes(): string[] {
  return Object.keys(countries.getAlpha2Codes());
}
