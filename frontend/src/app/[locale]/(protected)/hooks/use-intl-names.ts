"use client";

import { useLocale } from "next-intl";
import { useMemo } from "react";

export function useIntlNames() {
  const locale = useLocale();

  return useMemo(() => {
    const regionNames = new Intl.DisplayNames([locale], { type: "region" });
    const languageNames = new Intl.DisplayNames([locale], { type: "language" });

    const getCountryName = (code: string) => {
      try {
        return regionNames.of(code.toUpperCase()) || code;
      } catch {
        return code;
      }
    };

    const getLanguageName = (code: string) => {
      try {
        return languageNames.of(code.toLowerCase()) || code;
      } catch {
        return code;
      }
    };

    return { getCountryName, getLanguageName };
  }, [locale]);
}
