import { generateProfileUrl } from "@/app/lib/profile-url";
import { routing } from "@/i18n/routing";
import publicApi from "@/lib/public-api";

const STRAPI_PAGE_SIZE = 100;
const STRAPI_PAGES_PER_SITEMAP = 10;

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;
  const sitemapPage = parseInt(page);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const startPage = (sitemapPage - 1) * STRAPI_PAGES_PER_SITEMAP + 1;

  const allRecordings = [];
  for (let i = 0; i < STRAPI_PAGES_PER_SITEMAP; i++) {
    const response = await publicApi.recording.getRecordings({
      filters: {
        sources: {
          state: {
            $eq: "done",
          },
        },
      },
      populate: {
        follower: {
          fields: ["username", "type"],
        },
      },
      "pagination[page]": startPage + i,
      "pagination[pageSize]": STRAPI_PAGE_SIZE,
    });

    if (response.data.data?.length) {
      allRecordings.push(...response.data.data);
    } else {
      break;
    }
  }

  const urls = allRecordings
    .map((r) => {
      const path =
        generateProfileUrl(r.follower, false) + "/video/" + r.documentId;
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
        r.updatedAt +
        "</lastmod><changefreq>weekly</changefreq><priority>0.6</priority>" +
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
