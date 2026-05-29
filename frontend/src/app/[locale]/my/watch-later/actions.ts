"use server";

import publicApi from "@/lib/public-api";
import { getLocale } from "next-intl/server";

export async function getRecordingsByIds(documentIds: string[]) {
  if (documentIds.length === 0) return [];
  const locale = await getLocale();

  try {
    // POST /recordings/search — body avoids URL truncation when a power
    // user has 100+ entries in watch-later.
    const { data } = await publicApi.recording.searchRecordings({
      filters: {
        documentId: { $in: documentIds },
        sources: {
          state: {
            $eq: "done",
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
        ...(locale !== "en"
          ? {
              localizations: {
                fields: ["locale", "title", "description"],
                filters: { locale: { $eq: locale } },
              },
            }
          : {}),
      },
    });

    let rows = data.data || [];

    if (locale !== "en") {
      rows = rows.map((rec: any) => {
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

    return rows;
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return [];
  }
}
