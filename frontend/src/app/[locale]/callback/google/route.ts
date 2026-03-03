import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture?: string;
}

const STATE_COOKIE = "google_oauth_state";
const TOKEN_KEY = "strapi_jwt";

function parseAction(state: string | null): string {
  if (!state) return "settings";
  const action = state.split(":")[0];
  if (["settings", "login", "signup"].includes(action)) return action;
  return "settings";
}

function redirect(path: string): NextResponse {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const response = NextResponse.redirect(`${baseUrl}${path}`);
  response.cookies.delete(STATE_COOKIE);
  return response;
}

function errorRedirect(action: string): NextResponse {
  const target =
    action === "settings" ? "/settings?google=error" : "/login?google=error";
  return redirect(target);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  const action = parseAction(state);

  if (error || !code) {
    return errorRedirect(action);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const redirectUri = `${baseUrl}/callback/google`;

    // Verify state cookie for CSRF protection
    const cookieStore = await cookies();
    const savedState = cookieStore.get(STATE_COOKIE)?.value;

    if (!savedState || savedState !== state) {
      console.error("Google callback: state mismatch");
      return errorRedirect(action);
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      },
    );

    const data: GoogleTokenResponse = await tokenResponse.json();

    if (data.error) {
      console.error("Google token exchange failed:", data.error_description);
      return errorRedirect(action);
    }

    const expiresAt = new Date(
      Date.now() + data.expires_in * 1000,
    ).toISOString();

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${data.access_token}` } },
    );
    const userInfo: GoogleUserInfo = await userInfoResponse.json();

    // Call Strapi to find or create user
    const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337";
    const loginResponse = await fetch(`${strapiUrl}/api/social-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "google",
        providerId: userInfo.id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
        email: userInfo.email,
        displayName: userInfo.name,
      }),
    });

    if (!loginResponse.ok) {
      const err = await loginResponse.json();
      console.error("Google auth login failed:", err);
      return errorRedirect(action);
    }

    const loginData = await loginResponse.json();

    // Set JWT cookie and redirect to dashboard
    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    response.cookies.set(TOKEN_KEY, loginData.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.delete(STATE_COOKIE);
    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    return errorRedirect(action);
  }
}
