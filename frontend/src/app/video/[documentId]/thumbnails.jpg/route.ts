import publicApi from "@/lib/public-api";
import { getBucket, getS3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";

const getSource = unstable_cache(
  async (documentId: string, sourceId: string | null) => {
    const { data } = await publicApi.source.getSources({
      filters: {
        ...(sourceId
          ? { documentId: sourceId }
          : {
              recording: {
                documentId,
              },
            }),
        state: {
          $ne: "failed",
        },
      },
      sort: "createdAt:asc",
      "pagination[limit]": 1,
    });
    return data.data?.[0] ?? null;
  },
  ["thumbnail-source"],
  { revalidate: 3600 },
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const sourceId = request.nextUrl.searchParams.get("sourceId");

  const source = await getSource(documentId, sourceId);

  if (!source?.path) {
    return new Response("Not found", { status: 404 });
  }

  const abortController = new AbortController();

  try {
    const s3 = getS3();
    const command = new GetObjectCommand({
      Bucket: getBucket(process.env.MEDIA_BUCKET!, source.createdAt),
      Key: decodeURIComponent(`${source.path.substring(1)}thumbnails.jpg`),
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
