// app/sitemaps/static.xml/route.ts

export const revalidate = 86400; // Cache for 1 day

export async function GET() {
  const baseUrl = "https://livestreamrecorder.com";

  const staticPages = [
    { url: "", priority: 1.0, changefreq: "daily" }, // Homepage
    //{ url: "/about", priority: 0.7, changefreq: "monthly" },
    { url: "/pricing", priority: 0.8, changefreq: "weekly" },
    { url: "/faq", priority: 0.6, changefreq: "monthly" },
    //{ url: "/contact", priority: 0.5, changefreq: "monthly" },
    { url: "/privacy", priority: 0.3, changefreq: "yearly" },
    { url: "/terms", priority: 0.3, changefreq: "yearly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map(
          (page) => `
        <url>
          <loc>${baseUrl}${page.url}</loc>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `
        )
        .join("")}
    </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
