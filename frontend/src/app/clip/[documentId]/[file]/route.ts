// app/clip/[documentId]/[file]/route.ts
import publicApi from "@/lib/public-api";
import { getBucket, getS3, proxySignedUrl } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { unstable_cache } from "next/cache";

const ALLOWED_EXTENSIONS = [".jpg", ".mp4"] as const;
type AllowedExt = (typeof ALLOWED_EXTENSIONS)[number];

function getExtension(file: string): AllowedExt | null {
  if (file.includes("..") || file.includes("/") || file.includes("\\")) {
    return null;
  }

  const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext as AllowedExt)
    ? (ext as AllowedExt)
    : null;
}

function buildDownloadFilename(clip: { path?: string; createdAt?: string }) {
  // path is like /tiktok/username/recordings/...
  const parts = clip.path?.split("/").filter(Boolean) || [];
  const username = parts[1] || "clip";
  const date = clip.createdAt
    ? new Date(clip.createdAt).toISOString().slice(0, 10)
    : "clip";
  return `${username}_${date}_clip.mp4`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ documentId: string; file: string }> },
) {
  const { documentId, file } = await params;
  const url = new URL(request.url);
  const isTikTokProxy = url.searchParams.has("tiktok");
  const isDownload = url.searchParams.has("download");

  const ext = getExtension(file);
  if (!ext) {
    return new Response("Invalid file", { status: 400 });
  }

  const getCachedClip = unstable_cache(
    async (id: string) => {
      try {
        const { data } = await publicApi.clip.getClipsId({ id });
        return data.data ?? null;
      } catch {
        return null;
      }
    },
    ["clip", documentId],
    { revalidate: 3600 },
  );

  const clip = await getCachedClip(documentId);

  if (!clip) {
    return new Response("Not found", { status: 404 });
  }

  const s3 = getS3();
  const bucket = `${process.env.CLIP_BUCKET!}-nbg`;
  const key = `${clip.path?.substring(1)}${documentId}/${file}`;
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ...(isDownload && {
      ResponseContentDisposition: `attachment; filename="${buildDownloadFilename(clip)}"`,
    }),
  });

  const abortController = new AbortController();

  try {
    // Redirect to S3 (unless TikTok proxy mode needs streaming)
    if (!isTikTokProxy) {
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return Response.redirect(proxySignedUrl(signedUrl), 302);
    }

    // Stream for TikTok proxy mode only
    const response = await s3.send(command, {
      abortSignal: abortController.signal,
    });

    return new Response(response.Body as ReadableStream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": response.ContentLength?.toString() || "",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    abortController.abort();

    if (error.Code === "NoSuchKey" || error.name === "NoSuchKey") {
      return new Response("Not found", { status: 404 });
    }

    console.error(`Error fetching ${file}:`, error);
    return new Response("Error", { status: 500 });
  }
}
