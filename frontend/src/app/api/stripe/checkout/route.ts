import api from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const PRICE_IDS: Record<string, string> = {
    monthly: process.env.STRIPE_PRICE_MONTHLY!,
    quarterly: process.env.STRIPE_PRICE_QUARTERLY!,
    annual: process.env.STRIPE_PRICE_ANNUAL!,
    lifetime: process.env.STRIPE_PRICE_LIFETIME!,
  };

  try {
    // Verify authenticated user - don't trust client-provided userId/email
    const currentUser =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!currentUser?.data?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = currentUser.data as {
      id: number;
      email: string;
    };
    const userId = user.id.toString();
    const userEmail = user.email;

    const { billingCycle } = await request.json();

    if (!billingCycle || !PRICE_IDS[billingCycle]) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 },
      );
    }

    const priceId = PRICE_IDS[billingCycle];
    const isLifetime = billingCycle === "lifetime";

    const baseUrl =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
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
        userId,
        billingCycle,
      },
    };

    if (!isLifetime) {
      sessionConfig.subscription_data = {
        metadata: {
          userId,
          billingCycle,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
