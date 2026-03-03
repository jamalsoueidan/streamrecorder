import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  error?: { message: string; type: string; code: number };
}

interface FacebookUserInfo {
  id: string;
  name: string;
  email?: string;
}

const STATE_COOKIE = "facebook_oauth_state";
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
    action === "settings"
      ? "/settings?facebook=error"
      : "/login?facebook=error";
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
    const appId = process.env.FACEBOOK_CLIENT_ID!;
    const appSecret = process.env.FACEBOOK_CLIENT_SECRET!;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const redirectUri = `${baseUrl}/callback/facebook`;

    // Verify state cookie for CSRF protection
    const cookieStore = await cookies();
    const savedState = cookieStore.get(STATE_COOKIE)?.value;

    if (!savedState || savedState !== state) {
      console.error("Facebook callback: state mismatch");
      return errorRedirect(action);
    }

    // Exchange code for tokens
    const tokenParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      code,
      redirect_uri: redirectUri,
    });

    const tokenResponse = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?${tokenParams.toString()}`,
    );

    const data: FacebookTokenResponse = await tokenResponse.json();

    if (data.error) {
      console.error("Facebook token exchange failed:", data.error.message);
      return errorRedirect(action);
    }

    const expiresAt = new Date(
      Date.now() + data.expires_in * 1000,
    ).toISOString();

    // Get user info from Facebook
    const userInfoResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${data.access_token}`,
    );
    const userInfo: FacebookUserInfo = await userInfoResponse.json();

    // Call Strapi to find or create user
    const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337";
    const loginResponse = await fetch(`${strapiUrl}/api/social-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "facebook",
        providerId: userInfo.id,
        accessToken: data.access_token,
        expiresAt,
        email: userInfo.email,
        displayName: userInfo.name,
      }),
    });

    if (!loginResponse.ok) {
      const err = await loginResponse.json();
      console.error("Facebook auth login failed:", err);
      if (err?.error?.details?.code === "EMAIL_TAKEN") {
        return redirect("/login?error=email_taken");
      }
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
    console.error("Facebook callback error:", error);
    return errorRedirect(action);
  }
}
