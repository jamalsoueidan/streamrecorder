"use server";

import { enrichClipsWithUrls } from "@/app/lib/clip-url.server";
import publicApi from "@/lib/public-api";

// Strapi doesn't support random sort natively. Fetch a recent pool and
// shuffle in-process — gives a fresh-feeling "for you" row without
// hitting the DB with anything expensive.
export async function fetchRandomClips(displayCount = 6, poolSize = 20) {
  const response = await publicApi.clip
    .getClips({
      populate: {
        follower: {
          populate: {
            avatar: { fields: ["url"] },
          },
        },
      },
      sort: "createdAt:desc",
      "pagination[pageSize]": poolSize,
      "pagination[page]": 1,
    } as never)
    .catch(() => null);

  const clips = response?.data?.data ?? [];
  if (!clips.length) return [];

  // Fisher–Yates shuffle, take first N
  const shuffled = [...clips];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const picked = shuffled.slice(0, displayCount);
  return enrichClipsWithUrls(picked);
}
