"use server";

export async function getFacebookAuthUrl(
  action: "settings" | "login" | "signup",
) {
  return `/api/auth/facebook?action=${action}`;
}
