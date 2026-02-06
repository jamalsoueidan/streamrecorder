import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ b64: string }> },
) {
  try {
    const { b64 } = await params;

    const b64String = Array.isArray(b64) ? b64.join("/") : b64;

    // Decode base64
    let imageUrl: string;
    try {
      imageUrl = Buffer.from(b64String, "base64").toString("utf-8");
    } catch {
      return NextResponse.json({ error: "Invalid base64" }, { status: 400 });
    }

    console.log(imageUrl);

    const url = new URL(imageUrl);
    const referer = `${url.protocol}//${url.hostname}/`;

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: referer,
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Upstream failed",
          status: response.status,
          url: imageUrl,
        },
        { status: 502 },
      );
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/webp";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Proxy error",
        message: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
