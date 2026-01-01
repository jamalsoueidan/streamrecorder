"use server";
import api from "@/lib/api";
import { deepMerge } from "@mantine/core";
import {
  buildFollowingFilters,
  followingDefaultOptions,
  FollowingFilters,
} from "../lib/search-params";

export async function fetchRecordings(filters: FollowingFilters, page: number) {
  const response = await api.recording.browseRecordings(
    deepMerge(followingDefaultOptions, {
      filters: buildFollowingFilters(filters),
      scope: filters.scope,
      sort: filters.sort,
      "pagination[page]": page,
      "pagination[pageSize]": 10,
    })
  );

  return {
    data: response.data?.data || [],
    meta: response.data?.meta,
  };
}
