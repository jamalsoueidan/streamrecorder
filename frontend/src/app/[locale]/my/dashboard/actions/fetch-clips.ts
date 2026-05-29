"use server";

import { enrichClipsWithUrls } from "@/app/lib/clip-url.server";
import publicApi from "@/lib/public-api";
import { getLocale } from "next-intl/server";

// Strapi doesn't support random sort natively. Fetch a recent pool and
// shuffle in-process — gives a fresh-feeling "for you" row without
// hitting the DB with anything expensive.
export async function fetchRandomClips(displayCount = 6, poolSize = 20) {
  const locale = await getLocale();

  // For non-default locales, populate only the matching localization so we
  // can override clip title/description in JS. Falls back to the base (en)
  // value when the localized row doesn't exist.
  const localePopulate =
    locale !== "en"
      ? {
          localizations: {
            fields: ["locale", "title", "description"],
            filters: { locale: { $eq: locale } },
          },
        }
      : {};

  const response = await publicApi.clip
    .getClips({
      populate: {
        follower: {
          populate: {
            avatar: { fields: ["url"] },
          },
        },
        ...localePopulate,
      },
      sort: "createdAt:desc",
      "pagination[pageSize]": poolSize,
      "pagination[page]": 1,
    } as never)
    .catch(() => null);

  let clips = response?.data?.data ?? [];
  if (!clips.length) return [];

  if (locale !== "en") {
    clips = clips.map((c: any) => {
      const loc = c.localizations?.[0];
      if (loc?.title) {
        return {
          ...c,
          title: loc.title,
          description: loc.description || c.description,
        };
      }
      return c;
    });
  }

  // Fisher–Yates shuffle, take first N
  const shuffled = [...clips];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const picked = shuffled.slice(0, displayCount);
  return enrichClipsWithUrls(picked);
}
