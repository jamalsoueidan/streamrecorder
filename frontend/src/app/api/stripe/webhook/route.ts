import publicApi from "@/lib/public-api";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getRoleIdByName, updateUserSubscription } from "../../freemius/utils";

// Find user by Stripe customer ID
async function findUserByStripeCustomerId(customerId: string) {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.usersList({
      query: {
        filters: {
          stripe: {
            $contains: `"customerId":${JSON.stringify(customerId)}`,
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
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        // Handles both subscription and lifetime (payment mode) purchases
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status !== "paid") {
          break;
        }

        const userId = session.metadata?.userId;
        const billingCycle = session.metadata?.billingCycle || "monthly";
        const isLifetime = billingCycle === "lifetime";
        const customerId = session.customer as string;

        if (!userId) {
          console.error("No userId in session metadata");
          break;
        }

        // Determine subscription end date
        let subscriptionEndDate: string | null = null;
        let subscriptionId: string | null = null;

        let isTrialing = false;

        if (session.subscription && !isLifetime) {
          const subscriptionData = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );
          subscriptionId = subscriptionData.id;
          isTrialing = subscriptionData.status === "trialing";

          // For trial: use trial_end, for paid: use current_period_end
          if (isTrialing && subscriptionData.trial_end) {
            subscriptionEndDate = new Date(
              subscriptionData.trial_end * 1000,
            ).toISOString();
          } else {
            const firstItem = subscriptionData.items.data[0];
            if (firstItem?.current_period_end) {
              subscriptionEndDate = new Date(
                firstItem.current_period_end * 1000,
              ).toISOString();
            }
          }
        } else if (isLifetime) {
          subscriptionEndDate = "2099-12-31T23:59:59Z";
          subscriptionId = session.id;
        }

        const premiumRoleId = await getRoleIdByName("premium");

        // Update user - use publicApi directly since we have the user ID
        await publicApi.usersPermissionsUsersRoles.usersUpdate({ id: userId }, {
          role: premiumRoleId || undefined,
          subscriptionStatus: isTrialing ? "trialing" : "active",
          subscriptionEndDate,
          billingPeriod: billingCycle,
          paymentProvider: "stripe",
          trialClaimed: true,
          stripe: JSON.stringify({
            customerId,
            subscriptionId,
          }),
        } as never);

        break;
      }

      case "customer.subscription.created": {
        // Subscription created (e.g., after trial ends or new subscription)
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get billing cycle from subscription metadata
        const billingCycle = subscription.metadata?.billingCycle || "monthly";

        const user = await findUserByStripeCustomerId(customerId);
        if (user?.id) {
          const premiumRoleId = await getRoleIdByName("premium");
          const firstItem = subscription.items.data[0];
          const subscriptionEndDate = firstItem?.current_period_end
            ? new Date(firstItem.current_period_end * 1000).toISOString()
            : null;

          await publicApi.usersPermissionsUsersRoles.usersUpdate(
            { id: user.id.toString() },
            {
              role: premiumRoleId || undefined,
              subscriptionStatus: "active",
              subscriptionEndDate,
              billingPeriod: billingCycle,
              paymentProvider: "stripe",
              trialClaimed: true,
              stripe: JSON.stringify({
                customerId,
                subscriptionId: subscription.id,
              }),
            } as never,
          );
        }
        break;
      }

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
            // Subscription renewed or reactivated - restore premium role
            const premiumRoleId = await getRoleIdByName("premium");
            const firstItem = subscription.items.data[0];
            const subscriptionEndDate = firstItem?.current_period_end
              ? new Date(firstItem.current_period_end * 1000).toISOString()
              : null;

            await updateUserSubscription(user.id.toString(), {
              subscriptionStatus: "active",
              ...(subscriptionEndDate && { subscriptionEndDate }),
              ...(premiumRoleId && { role: premiumRoleId }),
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

      case "invoice.paid": {
        // Invoice paid successfully (renewal confirmation)
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Only process subscription renewals, not manual or one-time invoices
        const billingReason = invoice.billing_reason;
        if (
          billingReason !== "subscription_cycle" &&
          billingReason !== "subscription_create"
        ) {
          break;
        }

        // Get subscription ID from line items
        const firstLine = invoice.lines?.data?.[0];
        const subscriptionId =
          firstLine?.parent?.subscription_item_details?.subscription;

        if (!subscriptionId) {
          break;
        }

        const user = await findUserByStripeCustomerId(customerId);
        if (user?.id) {
          // Fetch subscription to get updated period end
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
          const firstItem = subscription.items.data[0];
          const subscriptionEndDate = firstItem?.current_period_end
            ? new Date(firstItem.current_period_end * 1000).toISOString()
            : null;

          await updateUserSubscription(user.id.toString(), {
            subscriptionStatus: "active",
            ...(subscriptionEndDate && { subscriptionEndDate }),
          });
        }
        break;
      }

      case "charge.refunded": {
        // Refund issued - revoke premium access
        const charge = event.data.object as Stripe.Charge;
        const customerId = charge.customer as string;

        if (!customerId) {
          break;
        }

        const user = await findUserByStripeCustomerId(customerId);
        if (user?.id) {
          const basicRoleId = await getRoleIdByName("basic");

          // Reset user to basic - clear all subscription data
          await publicApi.usersPermissionsUsersRoles.usersUpdate(
            { id: user.id.toString() },
            {
              role: basicRoleId || undefined,
              subscriptionStatus: null,
              subscriptionEndDate: null,
              billingPeriod: null,
              paymentProvider: null,
              stripe: null,
            } as never,
          );
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
