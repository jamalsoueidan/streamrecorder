"use server";
import api from "@/lib/api";
import { deepMerge } from "@mantine/core";
import {
  buildRecordingFilters,
  DiscoverFilters,
  followingDefaultOptions,
} from "../lib/search-params";

export async function fetchRecordings(filters: DiscoverFilters, page: number) {
  const response = await api.recording.browseRecordings(
    deepMerge(followingDefaultOptions, {
      filters: buildRecordingFilters(filters),
      scope: filters.scope,
      "pagination[page]": page,
      "pagination[pageSize]": 10,
    })
  );

  return {
    data: response.data?.data || [],
    meta: response.data?.meta,
  };
}
