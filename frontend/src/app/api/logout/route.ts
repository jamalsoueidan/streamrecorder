import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("strapi_jwt");

  const response = NextResponse.json({ success: true });

  response.headers.set(
    "Set-Cookie",
    "strapi_jwt=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
  );

  return response;
}
