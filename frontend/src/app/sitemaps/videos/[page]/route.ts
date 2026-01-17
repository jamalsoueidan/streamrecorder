import publicApi from "@/lib/public-api";

const STRAPI_PAGE_SIZE = 100;
const STRAPI_PAGES_PER_SITEMAP = 10; // 1000 URLs per sitemap

export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;
  const sitemapPage = parseInt(page);

  // Calculate which Strapi pages to fetch
  const startPage = (sitemapPage - 1) * STRAPI_PAGES_PER_SITEMAP + 1;

  // Fetch multiple Strapi pages
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allRecordings
        .map(
          (r) => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_BASE_URL}/${r.follower?.type}/${
            r.follower?.type === "tiktok"
              ? `@${r.follower.username}`
              : r.follower?.username
          }/video/${r.documentId}</loc>
          <lastmod>${r.updatedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
