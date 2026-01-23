"use server";
import publicApi from "@/lib/public-api";
import { deepMerge } from "@mantine/core";
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
      populate: ["videoSmall", "videoOriginal"], // we ask for original because sometime small is null while encoding for mini-player
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

export const getFollower = cache(async function getFollower({
  username,
  type,
  locale = "en",
}: {
  username: string;
  type: string;
  locale?: string;
}) {
  const filters = {
    username: decodeURIComponent(username).replace("@", ""),
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
    throw new Error("Follower not found");
  }

  return follower;
});

export async function getRecordingById(id: string) {
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

  if (!response.data.data?.[0]) {
    throw new Error("Recording not found");
  }

  return response.data.data?.[0];
}

export async function fetchProfileRecordings(type: string, username: string) {
  const response = await publicApi.recording.getRecordings(
    deepMerge(defaultOptions, {
      filters: {
        follower: {
          username: { $eq: decodeURIComponent(username).replace("@", "") },
          type: { $eq: type },
        },
        sources: {
          state: { $eq: ["done"] },
        },
      },
      sort: "createdAt:desc",
      "pagination[page]": 1,
      "pagination[pageSize]": 6,
    }),
  );

  return {
    data: response.data?.data || [],
    meta: response.data?.meta,
  };
}
