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

export const getFollower = cache(
  unstable_cache(
    async function (args: {
      username: string;
      type: string;
      locale?: string;
    }) {
      const { username, type, locale = "en" } = args;
      const filters = {
        ...usernameOrFilter(username),
        type,
      };

      // Try requested locale first
      let response = await publicApi.follower.getFollowers({
        filters,
        populate: ["avatar"],
        locale,
      });

      let follower = response.data.data?.at(0);

      // Fallback to default locale if not found
      if (!follower && locale !== "en") {
        response = await publicApi.follower.getFollowers({
          filters,
          populate: ["avatar"],
          locale: "en",
        });
        follower = response.data.data?.at(0);
      }

      if (!follower) {
        return null;
      }

      return follower;
    },
    ["public-follower"],
    { revalidate: 86400 },
  ),
);

export const getRecordingById = cache(
  unstable_cache(
    async (id: string) => {
      const response = await publicApi.recording.getRecordings({
        filters: {
          documentId: id,
        },
        populate: {
          sources: true,
          follower: {
            fields: ["username", "type", "nickname"],
            populate: ["avatar"],
          },
        },
      });

      return response.data.data?.[0] ?? null;
    },
    ["recording-by-id"],
    { revalidate: 86400 },
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
