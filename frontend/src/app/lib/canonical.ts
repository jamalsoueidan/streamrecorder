/**
 * The single primary domain for ALL SEO output — canonical tags, hreflang,
 * OG URLs, and every URL emitted in the XML sitemaps.
 *
 * Mirror deployments (.net / .org on other hosts) run this same code. If SEO
 * URLs used each deployment's own `NEXT_PUBLIC_BASE_URL`, the mirrors would
 * self-canonical and list their own URLs in the sitemap — competing with .com
 * as rival originals. That caused a sitewide deindex in June 2026.
 *
 * So SEO URLs ALWAYS resolve to the primary domain, regardless of which host
 * serves the request. Defaults to .com; override only for a genuinely separate
 * (non-mirror) site via NEXT_PUBLIC_CANONICAL_URL.
 */
export const CANONICAL_BASE_URL =
  process.env.NEXT_PUBLIC_CANONICAL_URL || "https://www.livestreamrecorder.com";
