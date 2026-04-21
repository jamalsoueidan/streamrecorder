import { generateProfileUrl } from "@/app/lib/profile-url";
import { routing } from "@/i18n/routing";
import publicApi from "@/lib/public-api";

const STRAPI_PAGE_SIZE = 100;
const PAGES_PER_SITEMAP = 5;

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;
  const sitemapPage = parseInt(page);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const startPage = (sitemapPage - 1) * PAGES_PER_SITEMAP + 1;

  const results = await Promise.all(
    Array.from({ length: PAGES_PER_SITEMAP }, (_, i) =>
      publicApi.follower.browseFollowers({
        hasRecordings: true,
        "pagination[page]": startPage + i,
        "pagination[pageSize]": STRAPI_PAGE_SIZE,
      }),
    ),
  );

  const allFollowers = results.flatMap((r) => r.data.data || []);

  const urls = allFollowers
    .map((f) => {
      const path = generateProfileUrl(f, false);
      const alternates = routing.locales
        .map((locale) => {
          const href = baseUrl + (locale === "en" ? "" : "/" + locale) + path;
          return (
            '<xhtml:link rel="alternate" hreflang="' +
            locale +
            '" href="' +
            href +
            '"/>'
          );
        })
        .join("");
      const xdefault =
        '<xhtml:link rel="alternate" hreflang="x-default" href="' +
        baseUrl +
        path +
        '"/>';
      return (
        "<url><loc>" +
        baseUrl +
        path +
        "</loc><lastmod>" +
        f.updatedAt +
        "</lastmod><changefreq>daily</changefreq><priority>0.8</priority>" +
        alternates +
        xdefault +
        "</url>"
      );
    })
    .join("");

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    urls +
    "</urlset>";

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
