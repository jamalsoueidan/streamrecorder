import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "tr", "ko", "ja", "es", "pt", "id"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: false,
  localeDetection: false,
});

// OpenGraph locale mapping for SEO metadata
export const OG_LOCALES: Record<string, string> = {
  en: "en_US", // English
  ar: "ar_SA", // Arabic
  tr: "tr_TR", // Turkish
  es: "es_LA", // Spanish (Latin American)
  pt: "pt_BR", // Portuguese (Brazilian)
  id: "id_ID", // Indonesian
  ko: "ko_KR", // Korean
  ja: "ja_JP", // Japanese
};

export function getOgLocale(locale: string): string {
  return OG_LOCALES[locale] || "en_US";
}

export function getAlternateOgLocales(currentLocale: string): string[] {
  return routing.locales
    .filter((loc) => loc !== currentLocale)
    .map((loc) => OG_LOCALES[loc] || "en_US");
}
