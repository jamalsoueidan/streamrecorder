import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Actually delete
  cookieStore.delete({
    name: "strapi_jwt",
    path: "/",
  });

  const response = NextResponse.json({ success: true });

  // Also set expired cookie in header to be sure
  response.headers.set(
    "Set-Cookie",
    "strapi_jwt=deleted; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  return response;
}
