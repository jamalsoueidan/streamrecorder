"use server";

import api from "@/lib/api";

export async function downloadRecording(
  videoDocumentId: string,
  locale: string,
): Promise<void> {
  const user =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});
  const userId = (user?.data as any)?.id;
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
}
