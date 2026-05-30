// NOTE: do NOT add "use server" here. These functions are called from
// server components (page.tsx) only. Marking them as Server Actions
// would force every page that uses them to render dynamically, which
// kills the `revalidate = 86400` ISR caching on those pages.
import { usernameOrFilter } from "@/app/lib/username-filter";
import publicApi from "@/lib/public-api";
import { deepMerge } from "@mantine/core";
import { unstable_cache } from "next/cache";
import { cache } from "react";

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
          $eq: ["done"],
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

// Tag scheme: one tag per follower. blockFollowerAndPurge calls
// revalidateTag(publicFollowerTag(type, username)) to bust EXACTLY this
// follower's cache without touching anyone else's.
export const publicFollowerTag = (type: string, username: string) =>
  `public-follower:${type.toLowerCase()}:${username.toLowerCase()}`;

export const getFollower = cache(
  async (args: { username: string; type: string; locale?: string }) => {
    const { username, type, locale = "en" } = args;

    // unstable_cache is built inside the call so we can attach a tag that
    // includes the type+username — the `tags` option is static per
    // unstable_cache instance, so per-follower tags require per-call
    // construction. The cache key (third arg) still scopes to type+username
    // so each follower gets its own cache entry.
    return unstable_cache(
      async () => {
        const filters = { ...usernameOrFilter(username), type };

        let response = await publicApi.follower.getFollowers({
          filters,
          populate: ["avatar"],
          locale,
        });
        let follower = response.data.data?.at(0);

        if (!follower && locale !== "en") {
          response = await publicApi.follower.getFollowers({
            filters,
            populate: ["avatar"],
            locale: "en",
          });
          follower = response.data.data?.at(0);
        }

        return follower ?? null;
      },
      ["public-follower", type, username, locale],
      {
        revalidate: 86400,
        tags: [publicFollowerTag(type, username)],
      },
    )();
  },
);

export const getRecordingById = cache(
  unstable_cache(
    async (id: string, locale: string = "en") => {
      const populate = {
        sources: true,
        follower: {
          fields: ["username", "type", "nickname"],
          populate: ["avatar"],
        },
      } as const;

      // Try the requested locale first. Not every recording has been
      // translated yet (cron may not have processed it), so fall back to
      // English if the localized row doesn't exist. This way Arabic/JP/etc.
      // pages still render with the English title/description rather than
      // 404 or show blank.
      const tryFetch = (loc: string) =>
        publicApi.recording.getRecordings({
          filters: { documentId: id },
          populate,
          locale: loc,
        });

      let response = await tryFetch(locale);
      let row = response.data.data?.[0];

      if (!row && locale !== "en") {
        response = await tryFetch("en");
        row = response.data.data?.[0];
      }

      return row ?? null;
    },
    ["recording-by-id"],
    { revalidate: 3600 },
  ),
);

export const fetchProfileRecordings = cache(
  unstable_cache(
    async function (type: string, username: string) {
      const response = await publicApi.recording.getRecordings(
        deepMerge(defaultOptions, {
          filters: {
            hidden: { $ne: true },
            follower: {
              ...usernameOrFilter(username),
              type: { $eq: type },
            },
            sources: {
              state: { $eq: ["done"] },
            },
          },
          sort: "createdAt:desc",
          "pagination[page]": 1,
          "pagination[pageSize]": 5,
        }),
      );

      return {
        data: response.data?.data || [],
        meta: response.data?.meta,
      };
    },
    ["public-profile-recordings"],
    { revalidate: 86400 },
  ),
);
