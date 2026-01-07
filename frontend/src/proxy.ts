import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PLATFORMS = ["tiktok", "twitch", "youtube"];

export function proxy(request: NextRequest) {
  console.log("Middleware hit:", request.nextUrl.pathname);
  const token = request.cookies.get("strapi_jwt");
  const path = request.nextUrl.pathname;

  // Check if it's a platform route like /tiktok/@username/...
  const firstSegment = path.split("/")[1];

  if (PLATFORMS.includes(firstSegment)) {
    if (token) {
      return NextResponse.rewrite(new URL(`/protected${path}`, request.url));
    } else {
      return NextResponse.rewrite(new URL(`/public${path}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(tiktok|twitch|youtube)/:path*"],
};
