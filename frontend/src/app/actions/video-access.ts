"use server";

import api from "@/lib/api";
import { MAX_PUBLIC_VIEWS } from "@/lib/constants";
import publicApi from "@/lib/public-api";

export type VideoAccessResult =
  | { allowed: true }
  | { allowed: false; reason: "upgrade" };

/**
 * Read-only access check for a recording.
 * Called from (protected) @modal pages — user is always logged in.
 * Does NOT record the view; that still happens in playlist.m3u8/route.ts.
 */
export async function checkVideoAccess(
  recordingDocumentId: string,
): Promise<VideoAccessResult> {
  const recordingResponse = await publicApi.recording.getRecordings({
    filters: { documentId: { $eq: recordingDocumentId } },
    populate: "follower",
    "pagination[limit]": 1,
  });

  const recording = recordingResponse.data.data?.[0];
  if (!recording) {
    return { allowed: true };
  }

  const followerDocumentId = recording.follower?.documentId;

  const user =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
      populate: {
        role: true,
        followers: { fields: ["documentId"] },
      },
    });

  const roleType = (user?.data?.role as any)?.type;
  //const subscriptionStatus = (user?.data as any)?.subscriptionStatus;
  const userId = (user?.data as any)?.documentId;

  if (
    roleType === "admin" ||
    roleType === "champion" ||
    roleType === "premium"
  ) {
    return { allowed: true };
  }

  if (followerDocumentId) {
    const userFollowers = (user?.data as any)?.followers || [];
    const isFollowing = userFollowers.some(
      (f: any) => f.documentId === followerDocumentId,
    );
    if (isFollowing) {
      return { allowed: true };
    }
  }

  if (!userId) {
    return { allowed: false, reason: "upgrade" };
  }

  const userFingerprint = `user:${userId}`;
  const { data: viewsData } = await publicApi.visitorView.getVisitorViews({
    filters: { fingerprint: { $eq: userFingerprint } },
    populate: "recording",
    "pagination[limit]": MAX_PUBLIC_VIEWS + 1,
  });

  const viewedRecordings = new Set(
    viewsData.data?.map((v) => v.recording?.documentId).filter(Boolean),
  );

  if (viewedRecordings.has(recordingDocumentId)) {
    return { allowed: true };
  }

  if (viewedRecordings.size >= MAX_PUBLIC_VIEWS) {
    return { allowed: false, reason: "upgrade" };
  }

  return { allowed: true };
}
