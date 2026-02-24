"use server";

export async function downloadRecording(
  videoDocumentId: string,
  userId: number,
  locale: string
): Promise<void> {
  const url = process.env.N8N_URL + "/webhook/download";
  const body = JSON.stringify({ videoDocumentId, userId, locale });

  console.log("[downloadRecording] url:", url);
  console.log("[downloadRecording] token set:", !!process.env.N8N_TOKEN);
  console.log("[downloadRecording] body:", body);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.N8N_TOKEN}`,
      },
      body,
    });
    console.log("[downloadRecording] response status:", res.status);
  } catch (err) {
    console.error("[downloadRecording] fetch error:", err);
  }
}
