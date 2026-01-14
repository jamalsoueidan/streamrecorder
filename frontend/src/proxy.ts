import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { streamingPlatforms } from "./app/lib/streaming-platforms";
import { routing } from "./i18n/routing";

const PLATFORMS = streamingPlatforms.map((p) => p.name.toLowerCase());

// Get locales from your config
const locales = routing.locales; // e.g. ["en", "ar", "fr", "es"]
const defaultLocale = routing.defaultLocale; // e.g. "en"

const handleI18nRouting = createIntlMiddleware(routing);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (/\.[a-z0-9]{2,5}$/i.test(path)) {
    return NextResponse.next();
  }

  // Check for locale prefix
  const pathSegments = path.split("/");
  const firstSegment = pathSegments[1];

  const hasLocalePrefix = locales.includes(firstSegment as any);
  const locale = hasLocalePrefix ? firstSegment : defaultLocale;
  const pathWithoutLocale = hasLocalePrefix
    ? "/" + pathSegments.slice(2).join("/") || "/"
    : path;

  const platformSegment = pathWithoutLocale.split("/")[1];

  // Platform routes — ALWAYS rewrite
  if (PLATFORMS.includes(platformSegment)) {
    const token = request.cookies.get("strapi_jwt");
    const destination = token ? "protected" : "public";

    return NextResponse.rewrite(
      new URL(`/${locale}/${destination}${pathWithoutLocale}`, request.url)
    );
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|media|avatar).*)"],
};
