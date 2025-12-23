import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: process.env.NEXT_PUBLIC_STRAPI_URL + "/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
