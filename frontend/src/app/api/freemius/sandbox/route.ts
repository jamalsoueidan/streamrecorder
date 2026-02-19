import { createHash } from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productId = process.env.NEXT_PUBLIC_FREEMIUS_PRODUCT_ID!;
    const secretKey = process.env.FREEMIUS_SECRET_KEY!;
    const publicKey = process.env.NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY!;

    // Generate timestamp
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Generate sandbox token: md5(timestamp + product_id + secret_key + public_key + 'checkout')
    const token = createHash("md5")
      .update(timestamp + productId + secretKey + publicKey + "checkout")
      .digest("hex");

    return NextResponse.json({
      ctx: timestamp,
      token: token,
    });
  } catch (error) {
    console.error("Freemius sandbox error:", error);
    return NextResponse.json(
      { error: "Failed to get sandbox params" },
      { status: 500 }
    );
  }
}
