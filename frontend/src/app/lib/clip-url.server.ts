import "server-only";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3, proxyClipSignedUrl } from "@/lib/s3";

/**
 * Sign a clip.mp4 S3 URL and rewrite to clip.<host>.
 * Embed in server-rendered HTML so the browser plays directly through
 * the Cloudflare Worker — no per-play Vercel hit.
 */
export async function getSignedClipPlayUrl(
  clip: { documentId?: string | null; path?: string | null },
  expiresIn = 14400,
): Promise<string | null> {
  if (!clip.documentId || !clip.path) return null;
  const command = new GetObjectCommand({
    Bucket: "streamclips-nbg",
    Key: `${clip.path.substring(1)}${clip.documentId}/clip.mp4`,
  });
  const signedUrl = await getSignedUrl(getS3(), command, { expiresIn });
  return proxyClipSignedUrl(signedUrl);
}

/**
 * Same as getSignedClipPlayUrl but adds Content-Disposition: attachment
 * via S3 response-content-disposition override, so the browser saves
 * the file instead of playing it.
 */
export async function getSignedClipDownloadUrl(
  clip: {
    documentId?: string | null;
    path?: string | null;
    title?: string | null;
    createdAt?: string | null;
  },
  expiresIn = 14400,
): Promise<string | null> {
  if (!clip.documentId || !clip.path) return null;
  const filename = buildClipFilename(clip);
  const command = new GetObjectCommand({
    Bucket: "streamclips-nbg",
    Key: `${clip.path.substring(1)}${clip.documentId}/clip.mp4`,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  });
  const signedUrl = await getSignedUrl(getS3(), command, { expiresIn });
  return proxyClipSignedUrl(signedUrl);
}

export async function enrichClipWithUrls<
  T extends { documentId?: string | null; path?: string | null },
>(clip: T): Promise<T & { signedClipUrl: string | null }> {
  const signedClipUrl = await getSignedClipPlayUrl(clip);
  return { ...clip, signedClipUrl };
}

export async function enrichClipsWithUrls<
  T extends { documentId?: string | null; path?: string | null },
>(clips: T[]): Promise<(T & { signedClipUrl: string | null })[]> {
  return Promise.all(clips.map((c) => enrichClipWithUrls(c)));
}

function buildClipFilename(clip: {
  path?: string | null;
  createdAt?: string | null;
  title?: string | null;
}): string {
  if (clip.title) {
    return `${clip.title.replace(/[^\w._-]/g, "_")}.mp4`;
  }
  const parts = clip.path?.split("/").filter(Boolean) || [];
  const username = parts[1] || "clip";
  const date = clip.createdAt
    ? new Date(clip.createdAt).toISOString().slice(0, 10)
    : "clip";
  return `${username}_${date}_clip.mp4`;
}
