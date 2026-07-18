/**
 * Primary domain for SEO output that must be identical on every deployment:
 * <link rel="canonical">, hreflang alternates, sitemap URLs (page locs + video
 * media hosts), and JSON-LD structured-data URLs.
 *
 * The SAME codebase serves .com, .net and .org. .net/.org are mirrors — their
 * SEO output must point at .com, never their own host, or they self-canonical
 * and compete with .com as duplicate originals (which caused a sitewide deindex
 * in June 2026). The canonical host is ALWAYS .com, so it's a hardcoded
 * constant rather than an env knob — there is nothing to configure per env.
 *
 * (OAuth callbacks, /api/auth, Stripe and the media proxy still use
 * NEXT_PUBLIC_BASE_URL — those MUST keep the deployment's own host.)
 */
export const CANONICAL_BASE_URL = "https://www.livestreamrecorder.com";

/**
 * Build an absolute URL on the canonical (.com) host for SEO output — use this
 * everywhere we emit a URL into a sitemap or JSON-LD structured data, so mirror
 * deployments (.net/.org) never leak their own host into those signals.
 *
 * @param path - path beginning with "/" (or "" for the site root).
 */
export function canonicalUrl(path: string = ""): string {
  if (!path) return CANONICAL_BASE_URL;
  return `${CANONICAL_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
