import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { getBucket, getS3, proxySignedUrl } from "@/lib/s3";
import { getToken } from "@/lib/token";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";

const getSources = unstable_cache(
  async (documentId: string) => {
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
      "pagination[limit]": 100,
    });
    return data.data ?? [];
  },
  ["video-file-source"],
  { revalidate: 3600 },
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string; file: string }> },
) {
  const { documentId, file } = await params;
  const sourceId = request.nextUrl.searchParams.get("sourceId");
  const isDownload = request.nextUrl.searchParams.has("download");

  const sources = await getSources(documentId);

  const source = sourceId
    ? sources.find((s) => s.documentId === sourceId)
    : sources.at(-1);

  if (!source?.path) {
    return new Response("Not found", { status: 404 });
  }

  const s3 = getS3();
  const bucket = getBucket(process.env.MEDIA_BUCKET!, source.bucket);
  const key = `${source.path.substring(1)}${file}`;

  if (isDownload && file.endsWith(".mp4")) {
    const parts = source.path?.split("/").filter(Boolean) || [];
    const username = parts[1] || "video";
    const datePart = parts[2] || "";
    const filename = `${username}_${datePart}.mp4`;

    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const userResp =
          await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles(
            {},
          );
        const userNumericId = (userResp?.data as any)?.id;
        const userDocumentId = (userResp?.data as any)?.documentId;
        if (!userNumericId) return;

        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("x-real-ip") ||
          null;

        await publicApi.visitorDownload.postVisitorDownloads({
          data: {
            fingerprint: `user:${userDocumentId}`,
            ip,
            recording: documentId,
            user: userNumericId,
          } as never,
        });
      } catch (err) {
        console.error("[video/file route] visitor-download failed:", err);
      }
    })();

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return Response.redirect(proxySignedUrl(signedUrl), 302);
  }

  const abortController = new AbortController();

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
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
