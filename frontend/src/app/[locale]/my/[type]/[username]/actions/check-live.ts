"use server";

// Triggers the n8n live-status-check workflow for a streamer. Used when
// our recorder hasn't picked up that the streamer went live and the user
// wants to force a check + start recording.
//
// The n8n URL + token live in env vars so the webhook isn't exposed to
// the browser.

export type CheckLiveResult =
  | { ok: true; isLive: boolean; nickName?: string }
  | { ok: false; error: string };

export async function triggerLiveStatusCheck(
  username: string,
  type: string,
): Promise<CheckLiveResult> {
  // n8n's TikTok lookup fails (and times out at ~14s) when the username
  // includes the leading @. Strip it before forwarding.
  const cleanUsername = username.replace(/^@/, "");

  try {
    const res = await fetch(process.env.N8N_URL + "/webhook/live-status-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Token": process.env.N8N_TOKEN!,
      },
      body: JSON.stringify({
        username: cleanUsername,
        type,
        platform: process.env.NEXT_PUBLIC_PLATFORM!,
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Webhook returned ${res.status}` };
    }

    const data = await res.json();
    const entry = Array.isArray(data) ? data[0] : data;
    // The n8n workflow returns different shapes per platform branch:
    //   - tiktok / soop:    no boolean, but `best` is a real URL when live
    //                       (and "-" or missing when offline).
    //   - bigo:             { live: true/false }
    //   - some branches:    { isLive | is_live: true/false }
    // Treat as live if any boolean is true OR a real stream URL is set.
    const hasStream =
      typeof entry?.best === "string" && entry.best.startsWith("http");
    const isLive =
      Boolean(entry?.isLive ?? entry?.is_live ?? entry?.live) || hasStream;
    return {
      ok: true,
      isLive,
      nickName: entry?.nickName,
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error" };
  }
}
