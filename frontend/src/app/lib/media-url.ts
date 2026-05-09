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
