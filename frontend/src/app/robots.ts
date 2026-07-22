import { canonicalUrl } from "@/app/lib/canonical";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: canonicalUrl("/sitemap.xml"),
  };
}
