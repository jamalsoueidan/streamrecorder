"use server";

import api from "@/lib/api";
import { deepMerge } from "@mantine/core";
import { buildStrapiFilters, DiscoverFilters } from "../lib/search-params";

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

export async function fetchFollowers(filters: DiscoverFilters, page: number) {
  const response = await api.follower.browseFollowers(
    deepMerge(defaultOptions, {
      filters: buildStrapiFilters(filters),
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
