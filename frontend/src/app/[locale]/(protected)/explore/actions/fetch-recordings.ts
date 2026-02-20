"use server";
import api from "@/lib/api";
import { deepMerge } from "@mantine/core";
import {
  buildFollowingFilters,
  followingDefaultOptions,
  FollowingFilters,
} from "../lib/search-params";

export async function fetchRecordings(filters: FollowingFilters, page: number) {
  const response = await api.recording.exploreRecordings(
    deepMerge(followingDefaultOptions, {
      filters: buildFollowingFilters(filters),
      sort: filters.sort,
      "pagination[page]": page,
      "pagination[pageSize]": 15,
    }),
  );

  return {
    data: response.data?.data || [],
    meta: response.data?.meta,
  };
}
