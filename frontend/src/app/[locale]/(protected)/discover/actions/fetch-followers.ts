"use server";

import api from "@/lib/api";
import { deepMerge } from "@mantine/core";
import { buildCreatorsFilters, CreatorFilters } from "../lib/search-params";

const defaultOptions = {
  "pagination[pageSize]": 10,
  populate: {
    avatar: { fields: ["url"] },
    recordings: {
      populate: {
        sources: {
          fields: ["*"],
          filters: { state: { $ne: "failed" } },
        },
      },
    },
  },
};

export async function fetchFollowers(filters: CreatorFilters, page: number) {
  const response = await api.follower.discoverFollowers(
    deepMerge(defaultOptions, {
      filters: buildCreatorsFilters(filters),
      sort: filters.sort,
      hasRecordings: filters.hasRecordings,
      "pagination[page]": page,
    }),
  );

  return {
    data: response.data?.data || [],
    meta: response.data?.meta,
  };
}
