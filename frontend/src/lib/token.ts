import { cookies } from "next/headers";

const TOKEN_KEY = "strapi_jwt";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value || null;
  //console.log("getToken() called, token:", token ? "exists" : "null");
  return token;
}

export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  //console.log("setToken() called with token:", token.substring(0, 20) + "...");
  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function removeToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
}
