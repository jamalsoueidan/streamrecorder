"use client";

import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import { PlatformFilterMenu } from "../../components/platform-filter-menu";
import { clipsParsers } from "../lib/search-params";

/**
 * Platform filter for /my/clips — uses the shared PlatformFilterMenu (same as
 * the live page). Filters clips by follower.type; selecting a platform resets
 * pagination and preserves the current sort.
 */
export function ClipsPlatform() {
  const t = useTranslations("protected.live");
  const [filters, setFilters] = useQueryStates(clipsParsers);
  const [, setPage] = useQueryState("page", parseAsInteger);

  return (
    <PlatformFilterMenu
      value={filters.type}
      allLabel={t("allPlatforms")}
      onSelect={(value) => {
        setPage(null);
        setFilters({ type: value }, { shallow: false });
      }}
    />
  );
}
