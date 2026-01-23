import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // non-www to www
      {
        source: "/:path*",
        has: [{ type: "host", value: "livestreamrecorder.com" }],
        destination: "https://www.livestreamrecorder.com/:path*",
        permanent: true,
      },
      //webmaster tools
      {
        source: "/:platform(pandalive|tiktok|youtube|twitch|kick)",
        destination: "/recordings/:platform",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: process.env.STRAPI_URL + "/uploads/:path*",
      },
      {
        source: "/script.js",
        destination: `${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`,
      },
      {
        source: "/api/send",
        destination: `${process.env.NEXT_PUBLIC_UMAMI_URL}/api/send`,
      },
      {
        source: "/assets/placeholder/:path*",
        destination: "https://placehold.co/:path*",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
