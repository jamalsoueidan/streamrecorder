import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { streamingPlatforms } from "./app/lib/streaming-platforms";
import { routing } from "./i18n/routing";

const PLATFORMS = streamingPlatforms.map((p) => p.name.toLowerCase());

// Get locales from your config
const locales = routing.locales;
const defaultLocale = routing.defaultLocale;

const handleI18nRouting = createIntlMiddleware(routing);

const STATIC_EXT =
  /\.(js|json|css|ico|png|jpg|jpeg|gif|svg|webp|webm|mp4|mp3|woff|woff2|m3u8|ttf|eot|otf|json|xml|txt|map|pdf|zip)$/i;

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (STATIC_EXT.test(path)) {
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
    const rewriteUrl = `/${locale}/${destination}${pathWithoutLocale}`;

    // Only redirect if they want a NON-default locale
    if (!hasLocalePrefix) {
      const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

      if (
        cookieLocale &&
        cookieLocale !== defaultLocale &&
        locales.includes(cookieLocale as any)
      ) {
        const redirectUrl = `/${cookieLocale}${pathWithoutLocale}`;
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }

    const response = NextResponse.rewrite(new URL(rewriteUrl, request.url));
    response.headers.set("x-next-intl-locale", locale);
    return response;
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|media|avatar|assets|video|monitoring).*)"],
};
