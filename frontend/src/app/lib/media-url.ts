const MEDIA_PROXY =
  process.env.MEDIA_PROXY_HOST || process.env.NEXT_PUBLIC_MEDIA_PROXY_HOST;

/**
 * Generate a direct URL to an image file through the media proxy.
 * Falls back to the Next.js route if no proxy is configured.
 */
export function getImageUrl(
  recordingDocumentId: string,
  file: "preview.jpg" | "screenshot.jpg" | "thumbnails.jpg",
  source?: {
    path?: string | null;
    bucket?: string | null;
  } | null,
): string {
  if (MEDIA_PROXY && source?.path && source?.bucket) {
    return `https://${MEDIA_PROXY}/${source.bucket}${source.path}${file}`;
  }
  return `/video/${recordingDocumentId}/${file}`;
}
