"use server";

export async function getTikTokAuthUrl(
  action: "settings" | "login" | "signup",
) {
  return `/api/auth/tiktok?action=${action}`;
}
