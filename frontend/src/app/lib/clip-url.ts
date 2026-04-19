const PUBLIC_FILES = new Set(["thumbnail.jpg", "preview.mp4"]);

/**
 * Generate a direct URL to a clip file through the clip subdomain.
 * Only public files (.jpg, preview.mp4) go through the subdomain.
 * clip.mp4 goes through Next.js route for signing.
 */
export function getClipUrl(
  documentId: string,
  file: string,
  path?: string | null,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl && path && PUBLIC_FILES.has(file)) {
    const host = new URL(baseUrl).hostname.replace(/^www\./, "");
    return `https://clip.${host}${path}${documentId}/${file}`;
  }
  return `/clip/${documentId}/${file}`;
}
