"use server";

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
