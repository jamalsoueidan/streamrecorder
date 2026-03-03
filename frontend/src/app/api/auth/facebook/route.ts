import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const STATE_COOKIE = "facebook_oauth_state";

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action") || "login";

  const appId = process.env.FACEBOOK_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/callback/facebook`;
  const scope = "email,public_profile";

  const random = crypto.randomBytes(16).toString("hex");
  const state = `${action}:${random}`;

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    state,
  });

  const facebookUrl = `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;

  const response = NextResponse.redirect(facebookUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  return response;
}
