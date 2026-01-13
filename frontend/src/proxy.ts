import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PLATFORMS = [
  "tiktok",
  "twitch",
  "youtube",
  "kick",
  "afreecatv",
  "pandalive",
];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("strapi_jwt");
  const path = request.nextUrl.pathname;

  // Skip rewrite for client-side navigations (let intercepts work) for (protected)/@modal/(..)[type]/ to work
  const secFetchDest = request.headers.get("Sec-Fetch-Dest");

  // Only skip for client-side JS fetches (script, style, etc.)
  // Rewrite everything else: bots, direct visits, document requests
  const isClientSideFetch = secFetchDest && secFetchDest !== "document";

  if (isClientSideFetch) {
    return NextResponse.next();
  }

  // Check if it's a platform route like /tiktok/@username/...
  const firstSegment = path.split("/")[1];

  if (PLATFORMS.includes(firstSegment)) {
    if (token) {
      // Check if URL is ONLY the platform (e.g., /pandalive with nothing after)
      const segments = path.split("/").filter(Boolean);

      if (segments.length === 1) {
        // Only platform in URL, redirect to discover
        return NextResponse.redirect(
          new URL(`/discover?type=${firstSegment}`, request.url)
        );
      }
      return NextResponse.rewrite(new URL(`/protected${path}`, request.url));
    } else {
      return NextResponse.rewrite(new URL(`/public${path}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(tiktok|twitch|youtube|kick|afreecatv|pandalive)/:path*"],
};
