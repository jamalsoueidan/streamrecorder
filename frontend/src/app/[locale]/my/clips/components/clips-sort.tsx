"use client";

import { SegmentedControl, Tooltip } from "@mantine/core";
import {
  IconDownload,
  IconEye,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { clipsParsers, SortOptions } from "../lib/search-params";

export function ClipsSort() {
  const t = useTranslations("protected.common");
  const tFilters = useTranslations("protected.filters");
  const [filters, setFilters] = useQueryStates(clipsParsers);

  const sortData = [
    {
      value: SortOptions.createdAtDesc,
      label: (
        <Tooltip label={t("newest")} withArrow>
          <IconSortDescending size={18} stroke={1.8} />
        </Tooltip>
      ),
    },
    {
      value: SortOptions.createdAtAsc,
      label: (
        <Tooltip label={t("oldest")} withArrow>
          <IconSortAscending size={18} stroke={1.8} />
        </Tooltip>
      ),
    },
    {
      value: SortOptions.viewsCountDesc,
      label: (
        <Tooltip label={tFilters("sort.viewsCountDesc")} withArrow>
          <IconEye size={18} stroke={1.8} />
        </Tooltip>
      ),
    },
    {
      value: SortOptions.downloadsCountDesc,
      label: (
        <Tooltip label={tFilters("sort.downloadsCountDesc")} withArrow>
          <IconDownload size={18} stroke={1.8} />
        </Tooltip>
      ),
    },
  ];

  return (
    <SegmentedControl
      size="md"
      value={filters.sort}
      onChange={(value) =>
        setFilters({ sort: value as SortOptions }, { shallow: false })
      }
      data={sortData}
    />
  );
}
