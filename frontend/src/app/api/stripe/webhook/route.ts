import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getRoleIdByName,
  updateUserSubscription,
} from "../../freemius/utils";
import publicApi from "@/lib/public-api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Find user by Stripe customer ID
async function findUserByStripeCustomerId(customerId: string) {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.usersList({
      query: {
        filters: {
          stripe: {
            $contains: `"customerId":"${customerId}"`,
          },
        },
      },
    } as never);

    const users = response.data;
    return users[0] || null;
  } catch (error) {
    console.error("Failed to find user by Stripe customer ID:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 },
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 },
      );
    }

    switch (event.type) {
      case "customer.subscription.deleted": {
        // Subscription was cancelled and period ended
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await findUserByStripeCustomerId(customerId);
        if (user?.id) {
          const basicRoleId = await getRoleIdByName("basic");

          await updateUserSubscription(user.id.toString(), {
            subscriptionStatus: "expired",
            subscriptionEndDate: null,
            billingPeriod: null,
            ...(basicRoleId && { role: basicRoleId }),
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        // Subscription was updated (cancelled at period end, renewed, etc.)
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await findUserByStripeCustomerId(customerId);
        if (user?.id) {
          if (subscription.cancel_at_period_end) {
            // User cancelled but still has access until period end
            await updateUserSubscription(user.id.toString(), {
              subscriptionStatus: "cancelled",
            });
          } else if (subscription.status === "active") {
            // Subscription renewed or reactivated
            const firstItem = subscription.items?.data?.[0] as { current_period_end?: number } | undefined;
            const periodEnd = firstItem?.current_period_end;
            const subscriptionEndDate = periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null;

            await updateUserSubscription(user.id.toString(), {
              subscriptionStatus: "active",
              ...(subscriptionEndDate && { subscriptionEndDate }),
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        // Payment failed
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const user = await findUserByStripeCustomerId(customerId);
        if (user?.id) {
          // Don't downgrade immediately, just update status
          // Stripe will retry payment and eventually delete subscription if all retries fail
          await updateUserSubscription(user.id.toString(), {
            subscriptionStatus: "cancelled",
          });
        }
        break;
      }

      default:
        // Unhandled event type
        break;
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
