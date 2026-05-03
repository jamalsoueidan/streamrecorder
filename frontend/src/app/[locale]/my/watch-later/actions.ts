"use server";

import api from "@/lib/api";

export async function getRecordingsByIds(documentIds: string[]) {
  if (documentIds.length === 0) return [];

  try {
    const { data } = await api.recording.getRecordings({
      filters: {
        documentId: { $in: documentIds },
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
    });

    return data.data || [];
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return [];
  }
}
