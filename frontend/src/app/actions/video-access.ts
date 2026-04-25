export type VideoAccessResult =
  | { allowed: true }
  | { allowed: false; reason: "sign-in" | "upgrade" | "not-found" };

/**
 * Runs the server-side access flow for a recording: verifies the user
 * has permission, records the view, and sets the signed `view_session`
 * cookie that `/video/[id]/playlist.m3u8` requires. The playlist endpoint
 * itself does no DB work — it just validates the cookie, so the combined
 * signed playlist can be cached globally.
 */
export async function checkVideoAccess(
  recordingDocumentId: string,
): Promise<VideoAccessResult> {
  try {
    const res = await fetch(`/api/video-access/${recordingDocumentId}`, {
      method: "POST",
      credentials: "same-origin",
    });
    if (res.status === 404) {
      return { allowed: false, reason: "not-found" };
    }
    if (!res.ok) {
      return { allowed: false, reason: "upgrade" };
    }
    return (await res.json()) as VideoAccessResult;
  } catch {
    // Network failure (offline, DNS, etc.) — fetch throws rather than
    // returning a Response. Surface as upgrade so the UI doesn't get
    // stuck in a React Query error state.
    return { allowed: false, reason: "upgrade" };
  }
}
