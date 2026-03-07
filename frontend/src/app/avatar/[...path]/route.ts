import { s3Fsn1, s3Nbg1 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = path.join("/");
  const location = new URL(request.url).searchParams.get("location");

  const isNbg = location === "nbg1";
  const s3 = isNbg ? s3Nbg1 : s3Fsn1;
  const bucket = isNbg
    ? `${process.env.AVATAR_BUCKET!}-nbg`
    : process.env.AVATAR_BUCKET!;

  const abortController = new AbortController();

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: filePath });
    const response = await s3.send(command, {
      abortSignal: abortController.signal,
    });

    return new Response(response.Body as ReadableStream, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error: any) {
    abortController.abort();

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
