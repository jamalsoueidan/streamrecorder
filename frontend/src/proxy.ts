import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const PLATFORMS = [
  "tiktok",
  "twitch",
  "youtube",
  "kick",
  "afreecatv",
  "pandalive",
];

const handleI18nRouting = createIntlMiddleware(routing);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check for locale prefix
  const hasArPrefix = path.startsWith("/ar");
  const pathWithoutLocale = hasArPrefix ? path.replace(/^\/ar/, "") : path;
  const locale = hasArPrefix ? "ar" : "en";

  const firstSegment = pathWithoutLocale.split("/")[1];

  // Platform routes - handle auth rewrites
  if (PLATFORMS.includes(firstSegment)) {
    const token = request.cookies.get("strapi_jwt");

    // Skip rewrite for client-side navigations (for intercepting routes)
    const secFetchDest = request.headers.get("Sec-Fetch-Dest");
    const isClientSideFetch = secFetchDest && secFetchDest !== "document";

    if (isClientSideFetch) {
      return NextResponse.next();
    }

    if (token) {
      return NextResponse.rewrite(
        new URL(`/${locale}/protected${pathWithoutLocale}`, request.url)
      );
    } else {
      return NextResponse.rewrite(
        new URL(`/${locale}/public${pathWithoutLocale}`, request.url)
      );
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/((?!api|_next|_vercel|favicon.ico|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|json)$).*)",
  ],
};
