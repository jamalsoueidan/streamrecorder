"use server";

import crypto from "crypto";
import { cookies } from "next/headers";

const STATE_COOKIE = "google_oauth_state";

export async function getGoogleAuthUrl(
  action: "settings" | "login" | "signup",
) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/callback/google`;
  const scope = "openid email profile";

  const random = crypto.randomBytes(16).toString("hex");
  const state = `${action}:${random}`;

  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    state,
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
