"use cache";

import publicApi from "@/lib/public-api";
import { cacheLife } from "next/cache";

export async function getHomeFollowers() {
  cacheLife({ stale: 300, revalidate: 1800, expire: 3600 });
  const {
    data: { data: followers },
  } = await publicApi.follower.getFollowers({
    filters: {
      description: { $notNull: true },
    },
    "pagination[limit]": 30,
    "pagination[withCount]": false,
    sort: "updatedAt:desc",
    populate: { avatar: true },
  });
  return followers;
}

export async function getHomeRecordings() {
  cacheLife({ stale: 300, revalidate: 1800, expire: 3600 });
  const {
    data: { data: recordings },
  } = await publicApi.recording.getRecordings({
    filters: {
      sources: {
        state: {
          $eq: ["done"],
        },
      },
    },
    "pagination[limit]": 8,
    "pagination[withCount]": false,
    sort: "createdAt:desc",
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
        populate: {
          avatar: true,
        },
      },
    },
  });
  return recordings;
}

export async function getHomeClips() {
  cacheLife({ stale: 300, revalidate: 1800, expire: 3600 });
  const {
    data: { data: clips },
  } = await publicApi.clip.getRandomClips({
    limit: 8,
  });
  return clips;
}
