"use server";

import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { headers } from "next/headers";

export async function downloadRecording(
  videoDocumentId: string,
  locale: string,
): Promise<void> {
  const user =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});
  const userId = (user?.data as any)?.id;
  const userDocumentId = (user?.data as any)?.documentId;
  if (!userId) throw new Error("not authenticated");

  await fetch(process.env.N8N_URL + "/webhook/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Token": process.env.N8N_TOKEN!,
    },
    body: JSON.stringify({
      videoDocumentId,
      userId,
      locale,
      platform: process.env.NEXT_PUBLIC_PLATFORM!,
    }),
  });

  try {
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      null;

    await publicApi.visitorDownload.postVisitorDownloads({
      data: {
        fingerprint: `user:${userDocumentId}`,
        ip,
        recording: videoDocumentId,
        user: userId,
      } as never,
    });
  } catch (err) {
    console.error("[downloadRecording] visitor-download create failed:", err);
  }
}
