"use server";

import api from "@/lib/api";
import { deepMerge } from "@mantine/core";
import { buildCreatorsFilters, ExploreFilters } from "../lib/search-params";

const defaultOptions = {
  "pagination[pageSize]": 10,
  populate: {
    avatar: { fields: ["url"] },
    recordings: {
      populate: {
        sources: {
          fields: ["*"],
          filters: { state: { $ne: "failed" } },
          populate: ["videoSmall", "videoOriginal"],
        },
      },
    },
  },
};

export async function fetchFollowers(filters: ExploreFilters, page: number) {
  const response = await api.follower.browseFollowers(
    deepMerge(defaultOptions, {
      filters: buildCreatorsFilters(filters),
      scope: filters.scope,
      hasRecordings: filters.hasRecordings,
      "pagination[page]": page,
    })
  );

  return {
    data: response.data?.data || [],
    meta: response.data?.meta,
  };
}
