"use server";

import api from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createAiRequest(
  recordingDocumentId: string,
  options: {
    generateClips: boolean;
    generateMemes: boolean;
    generateProfile: boolean;
  },
) {
  try {
    const { data } = await api.aiRequest.mePostAiRequests({
      data: {
        recording: recordingDocumentId,
        generateClips: options.generateClips,
        generateMemes: options.generateMemes,
        generateProfile: options.generateProfile,
      },
    });

    revalidatePath("/ai-studio");
    return { success: true, documentId: data.data?.documentId };
  } catch (error) {
    console.error("Failed to create AI request:", error);
    return { success: false, error: "Failed to create AI request" };
  }
}

export const getFollower = async function ({
  documentId,
}: {
  documentId: string;
}) {
  // Try requested locale first
  let { data } = await api.follower.getFollowersId({ id: documentId }, {
    query: {
      populate: ["avatar", "localizations"],
    },
  } as never);

  return data;
};
