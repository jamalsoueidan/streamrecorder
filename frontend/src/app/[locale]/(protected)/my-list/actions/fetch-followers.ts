"use server";

import { usernameOrFilter } from "@/app/lib/username-filter";
import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { unstable_cache } from "next/cache";
import { buildCreatorsFilters, CreatorFilters } from "../lib/search-params";

const SORT_FIELD_MAP: Record<string, string> = {
  totalRecordings: "recordingsCount",
  latestRecording: "lastRecordingAt",
};

function mapSort(sort?: string): string | undefined {
  if (!sort) return undefined;
  const [field, dir] = sort.split(":");
  return `${SORT_FIELD_MAP[field] ?? field}:${dir ?? "desc"}`;
}

const cachedDiscover = unstable_cache(
  async (
    filters: CreatorFilters,
    page: number,
    followingIds: number[],
    favoriteIds: number[],
  ) => {
    const idScope = filters.favorites ? favoriteIds : followingIds;
    const baseFilters = buildCreatorsFilters(filters);
    const response = await publicApi.follower.getFollowers({
      "pagination[page]": page,
      "pagination[pageSize]": 10,
      "pagination[withCount]": true,
      sort: mapSort(filters.sort),
      populate: { avatar: { fields: ["url"] } },
      filters: {
        ...baseFilters,
        id: { $in: idScope.length > 0 ? idScope : [0] },
        ...(filters.hasRecordings ? { recordingsCount: { $gt: 0 } } : {}),
      },
    });

    return {
      data: response.data?.data || [],
      meta: response.data?.meta,
    };
  },
  ["my-list-followers"],
  { revalidate: 60 * 60 * 3 },
);

export async function fetchFollowers(
  filters: CreatorFilters,
  page: number,
  followingIds: number[],
  favoriteIds: number[],
) {
  return cachedDiscover(filters, page, followingIds, favoriteIds);
}

export async function getRecordings(
  username: string,
  type: string,
  page: number = 1,
  pageSize: number = 8,
) {
  const response = await api.recording.getRecordings({
    filters: {
      follower: {
        ...usernameOrFilter(username),
        type: { $eq: type },
      },
      sources: {
        state: { $ne: "failed" },
      },
    },
    populate: {
      sources: {
        fields: ["*"],
        filters: {
          state: {
            $ne: "failed",
          },
        },
      },
      follower: {
        fields: ["id"],
        populate: {
          owner: { fields: ["id"] },
        },
      },
    },
    sort: "createdAt:desc",
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "pagination[withCount]": true,
  });

  return {
    data: response.data?.data || [],
    meta: response.data?.meta,
  };
}
