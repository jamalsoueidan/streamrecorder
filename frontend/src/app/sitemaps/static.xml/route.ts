import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const staticPages = [
    { url: "", priority: 1.0, changefreq: "daily" },
    { url: "/news", priority: 0.6, changefreq: "weekly" },
    { url: "/changelog", priority: 0.4, changefreq: "weekly" },
    { url: "/pricing", priority: 0.6, changefreq: "weekly" },
    { url: "/faq", priority: 0.6, changefreq: "monthly" },
    { url: "/privacy", priority: 0.3, changefreq: "yearly" },
    { url: "/terms", priority: 0.3, changefreq: "yearly" },
    { url: `/creators/all`, priority: 0.8, changefreq: "daily" },
    ...streamingPlatforms.map((platform) => ({
      url: `/creators/${platform.name.toLowerCase()}`,
      priority: 0.8,
      changefreq: "daily",
    })),
    { url: `/recordings/all`, priority: 0.8, changefreq: "daily" },
    ...streamingPlatforms.map((platform) => ({
      url: `/recordings/${platform.name.toLowerCase()}`,
      priority: 0.8,
      changefreq: "daily",
    })),
  ];

  const urls = staticPages
    .map((page) => {
      const alternates = routing.locales
        .map((locale) => {
          const href =
            baseUrl + (locale === "en" ? "" : "/" + locale) + page.url;
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
        page.url +
        '"/>';
      return (
        "<url><loc>" +
        baseUrl +
        page.url +
        "</loc><changefreq>" +
        page.changefreq +
        "</changefreq><priority>" +
        page.priority +
        "</priority>" +
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
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
