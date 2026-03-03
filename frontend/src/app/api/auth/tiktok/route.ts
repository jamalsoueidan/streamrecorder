import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const PKCE_COOKIE = "tiktok_pkce_verifier";

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("hex");
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action") || "login";

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/callback/tiktok`;
  const scope = "user.info.basic,video.publish,video.upload";

  const random = crypto.randomBytes(16).toString("hex");
  const state = `${action}:${random}`;

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const tiktokUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  const response = NextResponse.redirect(tiktokUrl);
  response.cookies.set(PKCE_COOKIE, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  return response;
}
