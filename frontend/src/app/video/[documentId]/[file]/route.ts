import publicApi from "@/lib/public-api";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

const s3 = new S3Client({
  region: "fsn1",
  endpoint: "https://fsn1.your-objectstorage.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string; file: string }> },
) {
  const { documentId, file } = await params;
  const sourceId = request.nextUrl.searchParams.get("sourceId");

  const { data } = await publicApi.source.getSources({
    filters: {
      recording: {
        documentId,
      },
      state: {
        $ne: "failed",
      },
    },
    sort: "createdAt:asc",
    "pagination[limit]": 1,
  });

  if (!data.data) {
    return new Response("Not found", { status: 404 });
  }

  const sources = data.data;

  const path = sourceId
    ? sources.find((s) => s.documentId === sourceId)?.path
    : sources.at(-1)?.path;

  console.log(path);
  if (!path) {
    return new Response("Not found", { status: 404 });
  }

  const abortController = new AbortController();

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.MEDIA_BUCKET!,
      Key: decodeURIComponent(`${path.substring(1)}${file}`),
    });
    const response = await s3.send(command, {
      abortSignal: abortController.signal,
    });

    return new Response(response.Body as ReadableStream, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": response.ContentLength?.toString() || "",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error: any) {
    abortController.abort();

    if (error.Code === "NoSuchKey" || error.name === "NoSuchKey") {
      return new Response("Not found", { status: 404 });
    }

    console.error("Error fetching preview:", error);
    return new Response("Error", { status: 500 });
  }
}
