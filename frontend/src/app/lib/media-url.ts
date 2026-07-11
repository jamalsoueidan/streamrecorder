/**
 * Generate a direct URL to an image file through the media proxy.
 * Falls back to the Next.js route if no proxy is configured.
 *
 * Path segments are percent-encoded so non-ASCII usernames (e.g. Korean
 * `파타야피키누`) survive the round-trip through the browser → CF Worker → S3.
 */
export function encodePath(path: string): string {
  return path
    .split("/")
    .map((seg) => (seg ? encodeURIComponent(seg) : seg))
    .join("/");
}

export function getImageUrl(
  recordingDocumentId: string,
  file: "preview.jpg" | "screenshot.jpg" | "thumbnails.jpg",
  source?: {
    path?: string | null;
    bucket?: string | null;
  } | null,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl && source?.path && source?.bucket) {
    const host = new URL(baseUrl).hostname.replace(/^www\./, "");
    return `https://media.${host}/${source.bucket}${encodePath(source.path)}${file}`;
  }
  return `/video/${recordingDocumentId}/${file}`;
}

const B2_ENDPOINT = "s3.eu-central-003.backblazeb2.com";

/**
 * Direct URL to the 60-second preview (demo.mp4) via the media proxy.
 *
 * Only B2 sources have a demo.mp4 (created during the Hetzner→B2 migration
 * and by n8n on new uploads), so this returns null for Hetzner sources — the
 * caller then falls back to the truncated HLS playlist. Also null when no
 * proxy is configured (the Next file route can't serve mp4 inline).
 */
export function getDemoVideoUrl(
  source?: {
    path?: string | null;
    bucket?: string | null;
    endpoint?: string | null;
  } | null,
): string | null {
  if (source?.endpoint !== B2_ENDPOINT || !source?.path || !source?.bucket) {
    return null;
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return null;
  const host = new URL(baseUrl).hostname.replace(/^www\./, "");
  return `https://media.${host}/${source.bucket}${encodePath(source.path)}demo.mp4`;
}
