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
  let scope: RecordingScope = "following";

  console.log("[following] filters.favorites:", filters.favorites, "filters.scope:", filters.scope);

  if (filters.favorites) {
    scope = "favorites";
  } else if (filters.scope) {
    scope = filters.scope as RecordingScope;
  }

  return fetchCachedRecordings({
    scope,
    filters: buildFollowingFilters(filters),
    sort: filters.sort,
    page,
  });
}
