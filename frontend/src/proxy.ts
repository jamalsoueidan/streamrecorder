import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const locales = routing.locales;
const handleI18nRouting = createIntlMiddleware(routing);

const STATIC_EXT =
  /\.(js|json|css|ico|png|jpg|jpeg|gif|svg|webp|webm|mp4|mp3|woff|woff2|m3u8|mpd|ttf|eot|otf|json|xml|txt|map|pdf|zip|wasm)$/i;

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (STATIC_EXT.test(path)) {
    return NextResponse.next();
  }

  // Skip rewrites for already-forwarded server actions to prevent infinite loops
  // https://github.com/vercel/next.js/issues/84504
  if (request.headers.has("x-action-forwarded")) {
    return NextResponse.next();
  }

  // Detect /my/* (with optional locale prefix) — auth gate
  const pathSegments = path.split("/");
  const firstSegment = pathSegments[1];
  const hasLocalePrefix = locales.includes(firstSegment as any);
  const firstPathSegment = hasLocalePrefix ? pathSegments[2] : firstSegment;

  if (firstPathSegment === "my") {
    const token = request.cookies.get("strapi_jwt");
    if (!token) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("strapi_jwt");
      return response;
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|media|avatar|assets|video|clip/|serwist|meme).*)"],
};
