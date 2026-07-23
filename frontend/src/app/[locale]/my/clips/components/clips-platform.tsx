"use client";

import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import { Select } from "@mantine/core";
import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import { clipsParsers } from "../lib/search-params";

/**
 * Filters the user's clips by platform via the clip's `follower.type` relation.
 * Reuses the existing `protected.filters.platforms` i18n block (label + all +
 * per-platform names). "" = all platforms. Changing platform also resets page.
 */
export function ClipsPlatform() {
  const t = useTranslations("protected.filters.platforms");
  const [filters, setFilters] = useQueryStates(clipsParsers);
  const [, setPage] = useQueryState("page", parseAsInteger);

  const data = [
    { value: "", label: t("all") },
    ...streamingPlatforms.map((p) => {
      const key = p.name.toLowerCase();
      return { value: key, label: t.has(key) ? t(key) : p.name };
    }),
  ];

  return (
    <Select
      size="md"
      w={170}
      allowDeselect={false}
      checkIconPosition="right"
      aria-label={t("label")}
      value={filters.type}
      data={data}
      onChange={(value) => {
        setPage(null);
        setFilters({ type: value ?? "" }, { shallow: false });
      }}
    />
  );
}
