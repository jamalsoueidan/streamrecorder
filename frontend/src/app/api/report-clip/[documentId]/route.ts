import { getToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const token = await getToken();

  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const meRes = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!meRes.ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const me = await meRes.json();

  const body = await request.json().catch(() => ({}));

  const res = await fetch(`${STRAPI_URL}/api/clips/${documentId}/report`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      reporter: {
        id: me.id,
        username: me.username,
        email: me.email,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    return NextResponse.json(error, { status: res.status });
  }

  return NextResponse.json({ success: true });
}
