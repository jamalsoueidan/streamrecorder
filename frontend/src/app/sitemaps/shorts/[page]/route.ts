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

  const allClips = [];
  for (let i = 0; i < STRAPI_PAGES_PER_SITEMAP; i++) {
    const response = await publicApi.clip.getClips({
      populate: {
        follower: {
          fields: ["username", "type", "nickname"],
        },
      },
      "pagination[page]": startPage + i,
      "pagination[pageSize]": STRAPI_PAGE_SIZE,
    });

    if (response.data?.data?.length) {
      allClips.push(...response.data.data);
    } else {
      break;
    }
  }

  const urls = allClips
    .map((clip) => {
      const path = "/shorts/" + clip.documentId;
      const pageUrl = baseUrl + path;
      const videoUrl = baseUrl + `/clip/${clip.documentId}/clip.mp4`;
      const thumbnailUrl = baseUrl + `/clip/${clip.documentId}/thumbnail.jpg`;

      const creatorName =
        clip.follower?.nickname || clip.follower?.username || "Unknown";

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
        pageUrl +
        '"/>';

      const videoTag =
        "<video:video>" +
        "<video:thumbnail_loc>" +
        thumbnailUrl +
        "</video:thumbnail_loc>" +
        "<video:title>" +
        escapeXml(
          clip.title ||
            creatorName + "'s Clip - " + clip.createdAt?.split("T")[0],
        ) +
        "</video:title>" +
        "<video:description>" +
        escapeXml(
          clip.description ||
            "Watch " +
              creatorName +
              "'s " +
              clip.follower?.type +
              " clip from " +
              clip.createdAt?.split("T")[0],
        ) +
        "</video:description>" +
        "<video:content_loc>" +
        videoUrl +
        "</video:content_loc>" +
        "<video:duration>" +
        (clip.duration || 0) +
        "</video:duration>" +
        "<video:publication_date>" +
        clip.createdAt +
        "</video:publication_date>" +
        "</video:video>";

      return (
        "<url><loc>" +
        pageUrl +
        "</loc><lastmod>" +
        clip.updatedAt +
        "</lastmod>" +
        videoTag +
        alternates +
        xdefault +
        "</url>"
      );
    })
    .join("");

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    urls +
    "</urlset>";

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
