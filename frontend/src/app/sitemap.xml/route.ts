import publicApi from "@/lib/public-api";

const URLS_PER_SITEMAP = 1000;
const STRAPI_PAGE_SIZE = 100;
const STRAPI_PAGES_PER_SITEMAP = URLS_PER_SITEMAP / STRAPI_PAGE_SIZE; // 10

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const { data: follower } = await publicApi.follower.getFollowers({
    "pagination[page]": 1,
    "pagination[pageSize]": STRAPI_PAGE_SIZE,
  });

  const { data: recording } = await publicApi.recording.getRecordings({
    "pagination[page]": 1,
    "pagination[pageSize]": STRAPI_PAGE_SIZE,
  });

  // Calculate how many sitemap files we need
  const followerSitemapCount = Math.ceil(
    (follower.meta?.pagination?.pageCount || 1) / STRAPI_PAGES_PER_SITEMAP
  );

  const recordingSitemapCount = Math.ceil(
    (recording.meta?.pagination?.pageCount || 1) / STRAPI_PAGES_PER_SITEMAP
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://www.livestreamrecorder.com/sitemaps/static.xml</loc>
      </sitemap>
      ${Array.from(
        { length: followerSitemapCount },
        (_, i) => `
        <sitemap>
          <loc>https://www.livestreamrecorder.com/sitemaps/followers/${
            i + 1
          }.xml</loc>
        </sitemap>
      `
      ).join("")}
      ${Array.from(
        { length: recordingSitemapCount },
        (_, i) => `
        <sitemap>
          <loc>https://www.livestreamrecorder.com/sitemaps/videos/${
            i + 1
          }.xml</loc>
        </sitemap>
      `
      ).join("")}
    </sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
