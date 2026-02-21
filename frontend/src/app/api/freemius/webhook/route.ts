import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getRoleIdByName,
  findUserByFreemiusUserId,
  findUserByEmail,
  isSubscriptionClaimed,
  getBillingPeriod,
  updateUserSubscription,
} from "../utils";

// Verify webhook signature from Freemius
function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) return false;

  const secretKey = process.env.FREEMIUS_SECRET_KEY;
  if (!secretKey) return false;

  const computedSignature = createHmac("sha256", secretKey)
    .update(body)
    .digest("hex");

  try {
    const sigBuffer = Buffer.from(signature, "hex");
    const computedBuffer = Buffer.from(computedSignature, "hex");

    if (sigBuffer.length !== computedBuffer.length) return false;

    return timingSafeEqual(sigBuffer, computedBuffer);
  } catch {
    return false;
  }
}

// Freemius webhook events we care about
type FreemiusEvent =
  | "subscription.created"
  | "subscription.cancelled"
  | "subscription.renewal.failed.last"
  | "subscription.renewal.retry"
  | string;

interface FreemiusWebhookPayload {
  id: string;
  type: FreemiusEvent;
  plugin_id: string;
  user_id: string;
  install_id: string | null;
  created: string;
  is_live: boolean;
  data: {
    subscription_id: string;
    license_id: string;
    reason_ids?: string | null;
    reason?: string | null;
  };
  objects: {
    user: {
      id: string;
      email: string;
      first?: string;
      last?: string;
      ip?: string;
      is_verified?: boolean;
      created?: string;
    };
    subscription: {
      id: string;
      user_id: string;
      plan_id: string;
      pricing_id: string;
      license_id: string;
      billing_cycle: number; // 1 = monthly, 12 = yearly
      next_payment?: string;
      canceled_at?: string | null;
      amount_per_cycle: number;
      currency: string;
      created: string;
    };
    license: {
      id: string;
      user_id: string;
      plan_id: string;
      pricing_id: string;
      expiration: string;
      secret_key: string;
      is_cancelled: boolean;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get("x-signature");

    // Verify signature
    if (!verifySignature(body, signature)) {
      return NextResponse.json({ received: true });
    }

    const payload = JSON.parse(body) as FreemiusWebhookPayload;

    const { type, objects } = payload;
    const { user, subscription, license } = objects;

    switch (type) {
      case "subscription.created": {
        // Try to find user by Freemius ID first (if client-side partially succeeded)
        let createdUser = await findUserByFreemiusUserId(user.id);

        // If not found, try by email (fallback for when client-side completely failed)
        if (!createdUser) {
          createdUser = await findUserByEmail(user.email);
        }

        if (createdUser?.id) {
          // Check if subscription is already claimed by another user
          const alreadyClaimed = await isSubscriptionClaimed(
            subscription.id,
            createdUser.id,
          );
          if (alreadyClaimed) {
            break;
          }

          // Get premium role ID
          const premiumRoleId = await getRoleIdByName("premium");
          const billingPeriod = getBillingPeriod(subscription.billing_cycle);

          // For lifetime (billing_cycle 0), use far-future date
          const subscriptionEndDate = billingPeriod === "lifetime"
            ? "2099-12-31T23:59:59Z"
            : (subscription.next_payment || license.expiration);

          await updateUserSubscription(createdUser.id.toString(), {
            role: premiumRoleId || undefined,
            subscriptionStatus: "active",
            subscriptionEndDate,
            billingPeriod,
            paymentProvider: "freemius",
            trialClaimed: true,
            freemius: JSON.stringify({
              userId: user.id,
              subscriptionId: subscription.id,
              licenseId: license.id,
              billingPeriod,
            }),
          });
        }

        break;
      }

      case "subscription.cancelled": {
        const cancelledUser = await findUserByFreemiusUserId(user.id);
        if (cancelledUser?.id) {
          await updateUserSubscription(cancelledUser.id.toString(), {
            subscriptionStatus: "cancelled",
          });
        }

        break;
      }

      case "subscription.renewal.failed.last": {
        const expiredUser = await findUserByFreemiusUserId(user.id);
        if (expiredUser?.id) {
          const basicRoleId = await getRoleIdByName("basic");

          await updateUserSubscription(expiredUser.id.toString(), {
            subscriptionStatus: "expired",
            subscriptionEndDate: null,
            billingPeriod: null,
            ...(basicRoleId && { role: basicRoleId }),
          });
        }

        break;
      }

      case "subscription.renewal.retry":
      default:
        break;
    }

    return NextResponse.json({ received: true, type });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
