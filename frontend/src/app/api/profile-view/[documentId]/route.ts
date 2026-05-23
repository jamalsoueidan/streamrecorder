import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;

  try {
    await fetch(`${STRAPI_URL}/api/followers/${documentId}/view`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  } catch {
    // Best-effort counter — never block the client
  }

  return NextResponse.json({ ok: true });
}
