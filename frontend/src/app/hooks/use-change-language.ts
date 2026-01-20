import { routing } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

const SUPPORTED_LOCALES = routing.locales; // add your locales
type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE = routing.defaultLocale;

export function useChangeLanguage() {
  const pathname = usePathname();

  // Extract current locale from path
  const currentLocale =
    SUPPORTED_LOCALES.find(
      (locale) =>
        locale !== DEFAULT_LOCALE && pathname.startsWith(`/${locale}`),
    ) ?? DEFAULT_LOCALE;

  // Get path without locale prefix
  const basePath =
    SUPPORTED_LOCALES.reduce(
      (path, locale) => path.replace(new RegExp(`^/${locale}(?=/|$)`), ""),
      pathname,
    ) || "/";

  const switchLocale = useCallback(
    (newLocale: Locale | string) => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

      const href =
        newLocale === DEFAULT_LOCALE
          ? basePath
          : `/${newLocale}${basePath === "/" ? "" : basePath}`;

      window.location.href = href;
    },
    [basePath],
  );

  return {
    currentLocale,
    switchLocale,
    basePath,
    locales: SUPPORTED_LOCALES,
  };
}
