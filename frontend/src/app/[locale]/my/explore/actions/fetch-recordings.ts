"use server";

import {
  fetchCachedRecordings,
  RecordingScope,
} from "@/app/actions/recordings";
import {
  buildFollowingFilters,
  FollowingFilters,
} from "../lib/search-params";

export async function fetchRecordings(filters: FollowingFilters, page: number) {
  return fetchCachedRecordings({
    scope: (filters.scope as RecordingScope) || "all",
    filters: buildFollowingFilters(filters),
    sort: filters.sort,
    page,
  });
}
