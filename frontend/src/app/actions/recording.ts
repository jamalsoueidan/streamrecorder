"use server";

import api from "@/lib/api";
import { purgeCloudflareUrls } from "@/lib/cloudflare";
import publicApi from "@/lib/public-api";
import { revalidatePath } from "next/cache";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.livestreamrecorder.com";

function videoUrlsToPurge(
  documentId: string,
  follower: { type?: string; username?: string } | undefined,
): string[] {
  if (!follower?.type || !follower?.username) return [];
  return [
    `${BASE_URL}/${follower.type}/${follower.username}/video/${documentId}`,
    `${BASE_URL}/my/${follower.type}/${follower.username}/video/${documentId}`,
  ];
}

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
    // Get recording with sources + localizations + follower so we can
    // bust the right public page after deletion.
    const { data } = await publicApi.recording.getRecordingsId(
      { id: recordingDocumentId },
      {
        query: {
          populate: {
            sources: { fields: ["documentId"] },
            localizations: { fields: "locale" },
            follower: { fields: ["username", "type"] },
          },
        },
      } as never,
    );

    const recording = data?.data;
    const sources = (recording?.sources as { documentId: string }[]) || [];
    const localizations =
      (recording?.localizations as { locale: string }[]) || [];
    const follower = recording?.follower as
      | { username?: string; type?: string }
      | undefined;

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

    // Bust every cached surface that referenced this recording so the
    // deletion is visible immediately. Otherwise unstable_cache + the
    // static page cache keep serving the ghost recording for up to 1h.
    revalidatePath(`/my/video/${recordingDocumentId}/playlist.m3u8`);
    revalidatePath(`/video/${recordingDocumentId}/playlist.m3u8`);
    if (follower?.type && follower?.username) {
      revalidatePath(
        `/${follower.type}/${follower.username}/video/${recordingDocumentId}`,
      );
      revalidatePath(
        `/my/${follower.type}/${follower.username}/video/${recordingDocumentId}`,
      );
    }

    // Also drop Cloudflare's edge cache for the public video URL so
    // visitors get the deletion immediately worldwide.
    await purgeCloudflareUrls(videoUrlsToPurge(recordingDocumentId, follower));

    return { success: true };
  } catch (error) {
    console.error("Error deleting recording:", error);
    return { success: false, error: "Failed to delete recording" };
  }
}

export async function deleteRecordingSources(
  recordingDocumentId: string,
): Promise<ActionResult & { deletedCount?: number }> {
  try {
    // Get recording with sources + localizations + follower so we can
    // invalidate the right pages after deletion.
    const { data } = await api.recording.getRecordingsId(
      { id: recordingDocumentId },
      {
        query: {
          populate: {
            sources: { fields: ["documentId"] },
            localizations: { fields: ["locale"] },
            follower: { fields: ["username", "type"] },
          },
        },
      } as never,
    );

    const recording = data?.data;
    const sources = (recording?.sources as { documentId: string }[]) || [];
    const localizations =
      (recording?.localizations as { locale: string }[]) || [];
    const follower = recording?.follower as
      | { username?: string; type?: string }
      | undefined;

    // 1. Delete all sources
    await Promise.all(
      sources.map((source) =>
        api.source.deleteSourcesId({ id: source.documentId }),
      ),
    );

    // 2. Delete the recording itself (main + all localizations).
    //    This action used to only kill sources; users (rightly) expect
    //    "delete sources" from the recording menu to delete the recording
    //    too, otherwise the URL keeps resolving and the page keeps loading.
    await api.recording.deleteRecordingsId({ id: recordingDocumentId });
    await Promise.all(
      localizations.map((loc) =>
        api.recording.deleteRecordingsId({ id: recordingDocumentId }, {
          query: { locale: loc.locale },
        } as never),
      ),
    );

    // 3. Bust every cached surface that referenced this recording so the
    //    deletion is visible immediately instead of waiting up to 1h for
    //    unstable_cache TTL.
    revalidatePath(`/my/video/${recordingDocumentId}/playlist.m3u8`);
    revalidatePath(`/video/${recordingDocumentId}/playlist.m3u8`);
    if (follower?.type && follower?.username) {
      revalidatePath(
        `/${follower.type}/${follower.username}/video/${recordingDocumentId}`,
      );
      revalidatePath(
        `/my/${follower.type}/${follower.username}/video/${recordingDocumentId}`,
      );
    }

    // Also drop Cloudflare's edge cache for the public video URL.
    await purgeCloudflareUrls(videoUrlsToPurge(recordingDocumentId, follower));

    return { success: true, deletedCount: sources.length };
  } catch (error) {
    console.error("Error deleting recording sources:", error);
    return { success: false, error: "Failed to delete sources" };
  }
}

export async function resetRecordingCounters(
  recordingDocumentId: string,
): Promise<ActionResult> {
  try {
    const userResponse =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
        populate: { role: { fields: ["type"] } },
      });
    const roleType = (userResponse?.data as any)?.role?.type;
    if (roleType !== "admin") {
      return { success: false, error: "FORBIDDEN" };
    }

    await publicApi.recording.resetRecordingCounters({
      documentId: recordingDocumentId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting recording counters:", error);
    return { success: false, error: "Failed to reset counters" };
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
