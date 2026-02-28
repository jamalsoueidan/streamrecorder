"use server";

import api from "@/lib/api";

async function checkNotBasic(): Promise<boolean> {
  try {
    const user = await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
      populate: { role: true },
    });
    const roleType = (user?.data?.role as any)?.type;
    return roleType !== "authenticated";
  } catch {
    return false;
  }
}

export async function cropExportVideo(
  videoDocumentId: string,
  userId: number,
  startTime: number,
  endTime: number,
): Promise<void> {
  await fetch(process.env.N8N_URL + "/webhook/clip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Token": process.env.N8N_TOKEN!,
    },
    body: JSON.stringify({
      videoDocumentId,
      userId,
      startTime,
      endTime,
      action: "export",
    }),
  });
}

export async function cropDownloadVideo(
  videoDocumentId: string,
  userId: number,
  locale: string,
  startTime: number,
  endTime: number,
): Promise<void> {
  const canDownload = await checkNotBasic();
  if (!canDownload) {
    throw new Error("Premium subscription required");
  }

  await fetch(process.env.N8N_URL + "/webhook/crop-download-video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Token": process.env.N8N_TOKEN!,
    },
    body: JSON.stringify({
      videoDocumentId,
      userId,
      locale,
      startTime,
      duration: endTime - startTime,
    }),
  });
}
