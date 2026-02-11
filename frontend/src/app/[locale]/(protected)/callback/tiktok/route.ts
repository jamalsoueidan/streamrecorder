import api from "@/lib/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface TikTokTokenResponse {
  access_token: string;
  refresh_token: string;
  open_id: string;
  expires_in: number;
  token_type: string;
  error?: string;
  error_description?: string;
}

const PKCE_COOKIE = "tiktok_pkce_verifier";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Handle error from TikTok
  if (error) {
    return NextResponse.redirect(`${baseUrl}/settings?tiktok=error`);
  }

  // No code provided
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/settings?tiktok=error`);
  }

  try {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const redirectUri = `${baseUrl}/callback/tiktok`;

    // Get code verifier from cookie
    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get(PKCE_COOKIE)?.value;

    if (!codeVerifier) {
      return NextResponse.redirect(`${baseUrl}/settings?tiktok=error`);
    }

    // Exchange code for token
    const tokenResponse = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_key: clientKey!,
          client_secret: clientSecret!,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      },
    );

    const data: TikTokTokenResponse = await tokenResponse.json();

    if (data.error) {
      console.error("TikTok token exchange failed:", data.error_description);
      const response = NextResponse.redirect(
        `${baseUrl}/settings?tiktok=error`,
      );
      response.cookies.delete(PKCE_COOKIE);
      return response;
    }

    // Calculate expiration date
    const expiresAt = new Date(
      Date.now() + data.expires_in * 1000,
    ).toISOString();

    // Save to backend
    await api.tiktok.mePostTiktoks({
      data: {
        openId: data.open_id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
      },
    });

    const response = NextResponse.redirect(
      `${baseUrl}/settings?tiktok=connected`,
    );
    response.cookies.delete(PKCE_COOKIE);
    return response;
  } catch (error) {
    console.error("Error exchanging TikTok code:", error);
    const response = NextResponse.redirect(`${baseUrl}/settings?tiktok=error`);
    response.cookies.delete(PKCE_COOKIE);
    return response;
  }
}
