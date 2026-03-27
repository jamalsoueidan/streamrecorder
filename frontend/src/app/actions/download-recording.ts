"use server";

export async function downloadRecording(
  videoDocumentId: string,
  userId: number,
  locale: string,
): Promise<void> {
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
