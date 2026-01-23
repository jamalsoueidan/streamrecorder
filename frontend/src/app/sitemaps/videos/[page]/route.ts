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
          duration: {
            $gt: 60,
          },
        },
      },
      populate: {
        follower: {
          fields: ["username", "type", "nickname"],
        },
        sources: {
          fields: ["path", "duration"],
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
      const pageUrl = baseUrl + path;
      const videoUrl = baseUrl + `/api/playlist/${r.documentId}.m3u8`;

      const creatorName =
        r.follower?.nickname || r.follower?.username || "Unknown";
      const lastSource = r.sources?.[r.sources.length - 1];
      const thumbnailUrl = lastSource
        ? baseUrl + "/media" + lastSource.path + "screenshot.jpg"
        : "";
      const duration =
        r.sources?.reduce(
          (acc: number, s: any) => acc + (s.duration || 0),
          0,
        ) || 0;

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
        escapeXml(creatorName + "'s Stream - " + r.createdAt?.split("T")[0]) +
        "</video:title>" +
        "<video:description>" +
        escapeXml(
          "Watch " +
            creatorName +
            "'s recorded " +
            r.follower?.type +
            " live stream from " +
            r.createdAt?.split("T")[0],
        ) +
        "</video:description>" +
        "<video:content_loc>" +
        videoUrl +
        "</video:content_loc>" +
        "<video:duration>" +
        Math.min(Math.round(duration), 28800) +
        "</video:duration>" +
        "<video:publication_date>" +
        r.createdAt +
        "</video:publication_date>" +
        "</video:video>";

      return (
        "<url><loc>" +
        pageUrl +
        "</loc><lastmod>" +
        r.updatedAt +
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
