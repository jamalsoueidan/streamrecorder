"use server";

import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { deepMerge } from "@mantine/core";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const getUserFollowData = cache(async () => {
  const response =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
      populate: {
        followers: { fields: ["id"] },
        favorites: { fields: ["id"] },
      },
    });
  return {
    followingIds: (response.data?.followers?.map((f: any) => f.id) || []).sort(),
    favoriteIds: (response.data?.favorites?.map((f: any) => f.id) || []).sort(),
  };
});

const defaultOptions = {
  filters: {
    sources: {
      state: {
        $eq: ["done"],
      },
    },
  },
  populate: {
    sources: {
      fields: ["*"],
      filters: {
        state: {
          $eq: "done",
        },
      },
    },
    follower: {
      fields: ["username", "type"],
      populate: {
        avatar: {
          fields: ["url"],
        },
      },
    },
  },
};

const cachedGetRecordings = unstable_cache(
  async (
    followerFilter: string,
    filterKey: string,
    sort: string,
    page: number,
    pageSize: number,
  ) => {
    const filters = JSON.parse(filterKey);
    const follower = followerFilter ? { id: JSON.parse(followerFilter) } : {};

    const hasFollowerFilter = Object.keys(follower).length > 0;

    const response = await publicApi.recording.getRecordings(
      deepMerge(defaultOptions, {
        filters: {
          ...filters,
          ...(hasFollowerFilter ? { follower: { ...filters.follower, ...follower } } : {}),
        },
        sort,
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
        "pagination[withCount]": true,
      }),
    );

    return {
      data: response.data?.data || [],
      meta: response.data?.meta,
    };
  },
  ["recordings-cached"],
  { revalidate: 900 },
);

export type RecordingScope = "all" | "following" | "discover" | "favorites";

interface FetchOptions {
  scope: RecordingScope;
  filters: Record<string, any>;
  sort: string;
  page: number;
  pageSize?: number;
}

export async function fetchCachedRecordings({
  scope,
  filters,
  sort,
  page,
  pageSize = 15,
}: FetchOptions) {
  const filterKey = JSON.stringify(filters);

  // "all" — no follower filter, fully shared cache
  if (scope === "all") {
    return cachedGetRecordings("", filterKey, sort, page, pageSize);
  }

  // Fresh user data every call — no React cache
  const { followingIds, favoriteIds } = await getUserFollowData();
  console.log("[recordings] scope:", scope, "followingIds:", followingIds.length, "favoriteIds:", favoriteIds.length, "favIds:", favoriteIds.slice(0, 5));

  let followerFilter = "";

  if (scope === "favorites") {
    const ids = favoriteIds.length === 0 ? [0] : favoriteIds;
    followerFilter = JSON.stringify({ $in: ids });
  } else if (scope === "following") {
    const ids = followingIds.length === 0 ? [0] : followingIds;
    followerFilter = JSON.stringify({ $in: ids });
  } else if (scope === "discover") {
    if (followingIds.length > 0) {
      followerFilter = JSON.stringify({ $notIn: followingIds });
    }
  }

  return cachedGetRecordings(followerFilter, filterKey, sort, page, pageSize);
}
