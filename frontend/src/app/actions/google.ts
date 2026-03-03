"use server";

export async function getGoogleAuthUrl(
  action: "settings" | "login" | "signup",
) {
  return `/api/auth/google?action=${action}`;
}
