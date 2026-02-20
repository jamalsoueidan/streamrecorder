import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
  lifetime: process.env.STRIPE_PRICE_LIFETIME!,
};

export async function POST(request: NextRequest) {
  try {
    const { billingCycle, userEmail, userId } = await request.json();

    if (!billingCycle || !PRICE_IDS[billingCycle]) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      );
    }

    const priceId = PRICE_IDS[billingCycle];
    const isLifetime = billingCycle === "lifetime";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      billing_address_collection: "auto",
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: isLifetime ? "payment" : "subscription",
      success_url: `${baseUrl}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/premium?canceled=true`,
      metadata: {
        userId: userId,
        billingCycle: billingCycle,
      },
    };

    // Add subscription metadata for recurring payments
    if (!isLifetime) {
      sessionConfig.subscription_data = {
        metadata: {
          userId: userId,
          billingCycle: billingCycle,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
