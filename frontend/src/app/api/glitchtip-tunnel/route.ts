import { NextRequest, NextResponse } from "next/server";

const GLITCHTIP_URL = "https://glitchtip.livestreamrecorder.com";
const PROJECT_ID = "1";
const SENTRY_KEY = "1b9bd2e727a84cf09c443321fd53797a";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    await fetch(
      `${GLITCHTIP_URL}/api/${PROJECT_ID}/envelope/?sentry_key=${SENTRY_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
        body,
      },
    );

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
