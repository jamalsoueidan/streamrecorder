"use server";

import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  error?: string;
}

async function verifyOwnership(
  recordingDocumentId: string,
): Promise<{ isOwner: boolean; error?: string }> {
  try {
    // Get current user
    const userResponse =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!userResponse.data?.id) {
      return { isOwner: false, error: "Not authenticated" };
    }

    // Get recording with follower.owner populated
    const recordingResponse = await api.recording.getRecordingsId(
      { id: recordingDocumentId },
      {
        populate: {
          follower: {
            populate: ["owner"],
          },
        },
      },
    );

    const recording = recordingResponse.data?.data;
    if (!recording) {
      return { isOwner: false, error: "Recording not found" };
    }

    const ownerId = (recording.follower as any)?.owner?.id;
    if (ownerId !== userResponse.data.id) {
      return { isOwner: false, error: "You do not own this recording" };
    }

    return { isOwner: true };
  } catch (error) {
    console.error("Error verifying ownership:", error);
    return { isOwner: false, error: "Failed to verify ownership" };
  }
}

export async function deleteRecording(
  recordingDocumentId: string,
): Promise<ActionResult> {
  const ownership = await verifyOwnership(recordingDocumentId);

  if (!ownership.isOwner) {
    return { success: false, error: ownership.error };
  }

  try {
    await publicApi.recording.deleteRecordingsId({ id: recordingDocumentId });
    revalidatePath("/my-list");
    return { success: true };
  } catch (error) {
    console.error("Error deleting recording:", error);
    return { success: false, error: "Failed to delete recording" };
  }
}

export async function hideRecording(
  recordingDocumentId: string,
): Promise<ActionResult> {
  const ownership = await verifyOwnership(recordingDocumentId);

  if (!ownership.isOwner) {
    return { success: false, error: ownership.error };
  }

  try {
    await publicApi.recording.putRecordingsId(
      { id: recordingDocumentId },
      { data: { hidden: true } as never },
    );
    revalidatePath("/my-list");
    return { success: true };
  } catch (error) {
    console.error("Error hiding recording:", error);
    return { success: false, error: "Failed to hide recording" };
  }
}
