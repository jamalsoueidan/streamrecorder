import { getS3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = path.join("/");

  const abortController = new AbortController();

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AVATAR_BUCKET!,
      Key: filePath,
    });
    const response = await getS3().send(command, {
      abortSignal: abortController.signal,
    });

    return new Response(response.Body as ReadableStream, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error: any) {
    abortController.abort(); // ← CRITICAL: cleanup on error

    console.error(
      `[AVATAR] Failed to get: ${filePath}`,
      error.Code || error.name,
    );

    if (error.Code === "NoSuchKey" || error.name === "NoSuchKey") {
      return new Response("Not found", { status: 404 });
    }
    return new Response("Error fetching file", { status: 500 });
  }
}
