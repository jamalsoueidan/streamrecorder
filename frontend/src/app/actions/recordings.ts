"use server";

import { SUPPORTED_PLATFORM_TYPES } from "@/app/lib/streaming-platforms";
import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { deepMerge } from "@mantine/core";
import { getLocale } from "next-intl/server";
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
    followingIds: (
      response.data?.followers?.map((f: any) => f.id) || []
    ).sort(),
    favoriteIds: (response.data?.favorites?.map((f: any) => f.id) || []).sort(),
  };
});

// Owner-scoped views (following / favorites=my-list) — the user sees ALL of
// their own followers, including unlisted types (clapper, tango, ...).
const defaultFollowingOptions = {
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

// Discovery views (explore "all" / discover) additionally hide follower types
// that aren't publicly listed, so unlisted creators never surface to strangers.
const defaultExploreOptions = {
  ...defaultFollowingOptions,
  filters: {
    ...defaultFollowingOptions.filters,
    follower: {
      type: {
        $in: SUPPORTED_PLATFORM_TYPES,
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
    locale: string,
    isDiscovery: boolean,
  ) => {
    const filters = JSON.parse(filterKey);
    const follower = followerFilter ? { id: JSON.parse(followerFilter) } : {};

    // Discovery ("all"/"discover") hides unlisted follower types; owner-scoped
    // views ("following"/"favorites") see everything they follow.
    const base = isDiscovery ? defaultExploreOptions : defaultFollowingOptions;

    const hasFollowerFilter = Object.keys(follower).length > 0;

    // For non-default locales, ask Strapi to also include the localized row
    // (title + description) so we can override the base values in JS. The
    // filter on localizations keeps the payload tiny — one row per recording
    // instead of all 11 translations. If no localization exists for the
    // requested locale, we silently fall back to the base (en) title.
    const localePopulate =
      locale !== "en"
        ? {
            populate: {
              localizations: {
                fields: ["locale", "title", "description"],
                filters: { locale: { $eq: locale } },
              },
            },
          }
        : {};

    // POST /recordings/search — sends the filter array in the body, avoids
    // the ~2KB query-string limit that silently truncated long follower-id
    // $in arrays (a free user with 100+ followers would lose IDs and miss
    // recordings from the tail of their list).
    const response = await publicApi.recording.searchRecordings(
      deepMerge(deepMerge(base, localePopulate), {
        filters: {
          ...filters,
          ...(hasFollowerFilter
            ? { follower: { ...filters.follower, ...follower } }
            : {}),
        },
        sort,
        pagination: { page, pageSize, withCount: false },
      }),
    );

    let data = response.data?.data || [];

    // Locale fallback: pick the localized title/description if present,
    // otherwise keep the base (en) one. This keeps untranslated recordings
    // visible instead of disappearing.
    if (locale !== "en") {
      data = data.map((rec: any) => {
        const loc = rec.localizations?.[0];
        if (loc?.title) {
          return {
            ...rec,
            title: loc.title,
            description: loc.description || rec.description,
          };
        }
        return rec;
      });
    }

    return {
      data,
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
  const locale = await getLocale();

  // Discovery scopes hide unlisted follower types; owner scopes show all.
  const isDiscovery = scope === "all" || scope === "discover";

  // "all" — no follower filter, fully shared cache
  if (scope === "all") {
    return cachedGetRecordings(
      "",
      filterKey,
      sort,
      page,
      pageSize,
      locale,
      isDiscovery,
    );
  }

  // Fresh user data every call — no React cache
  const { followingIds, favoriteIds } = await getUserFollowData();

  let followerFilter = "";

  if (scope === "favorites") {
    const ids = favoriteIds.length === 0 ? [0] : favoriteIds;
    followerFilter = JSON.stringify({ $in: ids });
  } else if (scope === "following") {
    const ids = followingIds.length === 0 ? [0] : followingIds;
    followerFilter = JSON.stringify({ $in: ids });
  } else if (scope === "discover") {
    // Always use a distinct cache key for discover — never fall back to ""
    // (which would share the "all" cache and leak followed creators through).
    const ids = followingIds.length > 0 ? followingIds : [-1];
    followerFilter = JSON.stringify({ $notIn: ids });
  }

  return cachedGetRecordings(
    followerFilter,
    filterKey,
    sort,
    page,
    pageSize,
    locale,
    isDiscovery,
  );
}
