import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 512 * 1024) {
      return NextResponse.json({ status: "error", message: "Payload too large" }, { status: 413 });
    }

    const body = await request.arrayBuffer();
    const url = process.env.GLITCHTIP_URL || "https://glitchtip.livestreamrecorder.com";
    const projectId = process.env.GLITCHTIP_PROJECT_ID || "1";
    const key = process.env.GLITCHTIP_KEY || "1b9bd2e727a84cf09c443321fd53797a";

    const response = await fetch(
      `${url}/api/${projectId}/envelope/?sentry_key=${key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": request.headers.get("content-type") || "text/plain;charset=UTF-8",
        },
        body,
      },
    );

    if (!response.ok) {
      return NextResponse.json({ status: "error" }, { status: response.status });
    }

    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
