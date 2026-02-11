"use server";

import api from "@/lib/api";
import crypto from "crypto";
import { cookies } from "next/headers";

interface ActionResult {
  success: boolean;
  error?: string;
}

const PKCE_COOKIE = "tiktok_pkce_verifier";

// Generate PKCE code verifier (43-128 characters)
function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

// Generate PKCE code challenge from verifier
function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("hex");
}

export async function getTikTokAuthUrl(): Promise<string> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/callback/tiktok`;
  const state = crypto.randomBytes(16).toString("hex");
  const scope = "user.info.basic,video.publish,video.upload";

  // Generate PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Store code verifier in cookie for later use
  const cookieStore = await cookies();
  cookieStore.set(PKCE_COOKIE, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
  });

  return `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
}

export async function getTikTokConnection() {
  try {
    const response = await api.tiktok.meGetTiktoks();
    return response.data?.data || null;
  } catch {
    return null;
  }
}

export async function disconnectTikTok(id: string): Promise<ActionResult> {
  try {
    await api.tiktok.meDeleteTiktoksId({ id });
    return { success: true };
  } catch (error) {
    console.error("Error disconnecting TikTok:", error);
    return { success: false, error: "Failed to disconnect TikTok" };
  }
}
