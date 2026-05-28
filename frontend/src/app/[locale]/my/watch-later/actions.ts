"use server";

import publicApi from "@/lib/public-api";

export async function getRecordingsByIds(documentIds: string[]) {
  if (documentIds.length === 0) return [];

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
      },
    });

    return data.data || [];
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return [];
  }
}
