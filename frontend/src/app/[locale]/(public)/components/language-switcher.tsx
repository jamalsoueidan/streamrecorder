"use client";

import { Button, Group } from "@mantine/core";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const basePath = pathname.replace(/^\/ar/, "") || "/";

  const switchTo = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    const href =
      newLocale === "en" ? basePath : `/ar${basePath === "/" ? "" : basePath}`;
    window.location.href = href;
  };

  return (
    <Group>
      <Button
        onClick={() => switchTo("en")}
        variant={locale === "en" ? "filled" : "outline"}
        size="xs"
      >
        EN
      </Button>
      <Button
        onClick={() => switchTo("ar")}
        variant={locale === "ar" ? "filled" : "outline"}
        size="xs"
      >
        عربي
      </Button>
    </Group>
  );
}
