"use server";

import api from "@/lib/api";

export async function clearMyTracking(): Promise<{
  ok: boolean;
  deletedViews?: number;
  deletedDownloads?: number;
}> {
  try {
    const { data } = await api.instance.post("/visitor-views/clear-mine");
    return data;
  } catch (err) {
    console.error("[clearMyTracking] failed:", err);
    return { ok: false };
  }
}
