import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: "strapi_jwt",
    path: "/",
  });
}

export async function POST() {
  await clearSession();

  const response = NextResponse.json({ success: true });

  response.headers.set(
    "Set-Cookie",
    "strapi_jwt=deleted; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  return response;
}

export async function GET() {
  await clearSession();

  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));

  response.headers.set(
    "Set-Cookie",
    "strapi_jwt=deleted; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  return response;
}
