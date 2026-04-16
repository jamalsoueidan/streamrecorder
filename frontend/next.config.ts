import { loadEnvConfig } from "@next/env";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: Date.now().toString(),
  },
  serverExternalPackages: ["esbuild-wasm"],
  reactCompiler: true,
  output: "standalone",
  images: {
    unoptimized: true,
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
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
        source: "/assets/placeholder/:path*",
        destination: "https://placehold.co/:path*",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withSentryConfig(withNextIntl(nextConfig), {
  sentryUrl: "https://glitchtip.livestreamrecorder.com",
  org: process.env.GLITCHTIP_ORG,
  project: process.env.GLITCHTIP_PROJECT,
  authToken: process.env.GLITCHTIP_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
