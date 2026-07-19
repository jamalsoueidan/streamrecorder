/**
 * Force SEO URLs onto the primary .com domain.
 *
 * The SAME codebase serves .com, .net and .org; .net/.org are mirrors. Their
 * SEO output (canonical, hreflang, sitemaps, JSON-LD) must point at .com or they
 * self-canonical and compete with .com as duplicate originals (which caused a
 * sitewide deindex in June 2026). We keep using NEXT_PUBLIC_BASE_URL exactly as
 * before and just rewrite the mirror host to .com. Non-mirror hosts (localhost
 * in dev) pass through unchanged.
 */
export function canonical(url: string): string {
  return url.replace(/livestreamrecorder\.(net|org)/g, "livestreamrecorder.com");
}

/**
 * Absolute SEO URL: NEXT_PUBLIC_BASE_URL + path, with any mirror host forced to
 * the canonical .com. Use everywhere we emit a URL into a sitemap or JSON-LD.
 *
 * Normalizes the join so output is always absolute and slash-clean: the base
 * has trailing slashes trimmed and the path is given exactly one leading slash,
 * so a trailing slash in the env can never produce `//`.
 */
export function canonicalUrl(path: string = ""): string {
  const base = canonical((process.env.NEXT_PUBLIC_BASE_URL ?? "").trim()).replace(
    /\/+$/,
    "",
  );
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
