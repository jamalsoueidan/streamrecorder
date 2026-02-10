"use server";

import api from "@/lib/api";
import publicApi from "@/lib/public-api";

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
    const { data } = await api.recording.getRecordingsId(
      { id: recordingDocumentId },
      {
        query: {
          populate: {
            follower: {
              fields: ["id"],
              populate: ["owner"],
            },
          },
        },
      } as never,
    );

    const recording = data?.data;
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
    // Get recording with sources
    const { data } = await publicApi.recording.getRecordingsId(
      { id: recordingDocumentId },
      {
        query: {
          populate: {
            sources: { fields: ["documentId"] },
            localizations: {
              fields: "locale",
            },
          },
        },
      } as never,
    );

    const recording = data?.data;
    const sources = (recording?.sources as { documentId: string }[]) || [];
    const localizations =
      (recording?.localizations as { locale: string }[]) || [];

    // Delete all sources first
    await Promise.all(
      sources.map((source) =>
        publicApi.source.deleteSourcesId({ id: source.documentId }),
      ),
    );

    // Delete main recording with its locale
    await publicApi.recording.deleteRecordingsId({ id: recordingDocumentId });

    // Delete all localizations
    await Promise.all(
      localizations.map((loc) =>
        publicApi.recording.deleteRecordingsId({ id: recordingDocumentId }, {
          query: { locale: loc.locale },
        } as never),
      ),
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting recording:", error);
    return { success: false, error: "Failed to delete recording" };
  }
}

export async function toggleHidden(
  recordingDocumentId: string,
  currentlyHidden: boolean,
): Promise<ActionResult> {
  const ownership = await verifyOwnership(recordingDocumentId);

  if (!ownership.isOwner) {
    return { success: false, error: ownership.error };
  }

  try {
    await publicApi.recording.putRecordingsId(
      { id: recordingDocumentId },
      { data: { hidden: !currentlyHidden } as never },
    );
    return { success: true };
  } catch (error) {
    console.error("Error toggling hidden:", error);
    return { success: false, error: "Failed to update recording" };
  }
}
