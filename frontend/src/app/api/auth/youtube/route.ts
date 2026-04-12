import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const STATE_COOKIE = "youtube_oauth_state";

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action") || "settings";

  const clientId = process.env.YOUTUBE_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/callback/youtube`;
  const scope = "https://www.googleapis.com/auth/youtube.upload";

  const random = crypto.randomBytes(16).toString("hex");
  const state = `${action}:${random}`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    state,
    access_type: "offline",
    prompt: "consent",
  });

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const response = NextResponse.redirect(googleUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  return response;
}
