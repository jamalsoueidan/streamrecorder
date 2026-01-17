import publicApi from "@/lib/public-api";

const URLS_PER_SITEMAP = 1000;

export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;
  const sitemapPage = parseInt(page);

  // Calculate which Strapi pages to fetch
  const strapiPagesPerSitemap = URLS_PER_SITEMAP / 100;
  const startPage = (sitemapPage - 1) * strapiPagesPerSitemap + 1;

  // Fetch multiple Strapi pages
  const allFollowers = [];
  for (let i = 0; i < strapiPagesPerSitemap; i++) {
    const response = await publicApi.follower.getFollowers({
      "pagination[page]": startPage + i,
      "pagination[pageSize]": 100,
    });

    if (response.data.data?.length) {
      allFollowers.push(...response.data.data);
    } else {
      break;
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allFollowers
        .map(
          (f) => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_BASE_URL}/${f.type}/${
            f.type === "tiktok" ? `@${f.username}` : f.username
          }</loc>
          <lastmod>${f.updatedAt}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
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
