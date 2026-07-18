const PUBLIC_FILES = new Set(["thumbnail.jpg", "preview.mp4"]);

/**
 * Direct URL to a public clip file (thumbnail.jpg / preview.mp4).
 * For clip.mp4 use getSignedClipPlayUrl from clip-url.server.ts (server-only).
 */
export function getClipUrl(
  documentId: string,
  file: string,
  path?: string | null,
  // SEO contexts (sitemaps) pass CANONICAL_BASE_URL so the clip host resolves
  // to the primary domain instead of a mirror deployment's own host.
  baseUrlOverride?: string,
): string {
  const baseUrl = baseUrlOverride ?? process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl && path && PUBLIC_FILES.has(file)) {
    const host = new URL(baseUrl).hostname.replace(/^www\./, "");
    return `https://clip.${host}${path}${documentId}/${file}`;
  }
  return `/clip/${documentId}/${file}`;
}
