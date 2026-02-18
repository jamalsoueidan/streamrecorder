import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import publicApi from "@/lib/public-api";

// Verify webhook signature from Freemius
function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) {
    console.log("❌ No signature header found");
    return false;
  }

  const secretKey = process.env.FREEMIUS_SECRET_KEY;
  if (!secretKey) {
    console.log("❌ FREEMIUS_SECRET_KEY not configured");
    return false;
  }

  // Compute HMAC-SHA256 of the body using secret key
  const computedSignature = createHmac("sha256", secretKey)
    .update(body)
    .digest("hex");

  console.log("🔐 Signature Verification:");
  console.log("   Received:", signature);
  console.log("   Computed:", computedSignature);

  // Use timing-safe comparison to prevent timing attacks
  try {
    const sigBuffer = Buffer.from(signature, "hex");
    const computedBuffer = Buffer.from(computedSignature, "hex");

    if (sigBuffer.length !== computedBuffer.length) {
      console.log("❌ Signature length mismatch");
      return false;
    }

    const isValid = timingSafeEqual(sigBuffer, computedBuffer);
    console.log("   Valid:", isValid ? "✅ YES" : "❌ NO");
    return isValid;
  } catch {
    console.log("❌ Signature comparison failed");
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

    console.log("===========================================");
    console.log("FREEMIUS WEBHOOK RECEIVED");
    console.log("===========================================");

    // Verify signature
    if (!verifySignature(body, signature)) {
      console.log("❌ INVALID SIGNATURE - Rejecting webhook");
      // Return 200 to not expose info to attackers
      return NextResponse.json({ received: true });
    }

    console.log("✅ SIGNATURE VERIFIED");

    const payload = JSON.parse(body) as FreemiusWebhookPayload;

    // Debug logging
    console.log("Event Type:", payload.type);
    console.log("Event ID:", payload.id);
    console.log("Full Payload:", JSON.stringify(payload, null, 2));
    console.log("===========================================");

    const { type, objects } = payload;
    const { user, subscription, license } = objects;

    switch (type) {
      case "subscription.created": {
        console.log("📦 SUBSCRIPTION CREATED");
        console.log("Freemius User ID:", user.id);
        console.log("User Email:", user.email);
        console.log("User Name:", `${user.first || ""} ${user.last || ""}`.trim());
        console.log("Plan ID:", subscription.plan_id);
        console.log("Billing Cycle:", subscription.billing_cycle, "months");
        console.log("Next Payment:", subscription.next_payment);
        console.log("License Expiration:", license.expiration);

        // Find user in our system by Freemius ID
        const strapiUser = await findUserByFreemiusId(user.id);
        if (strapiUser) {
          console.log("Found Strapi user:", strapiUser.id);
          await updateUserSubscription(strapiUser.id, {
            subscriptionStatus: "active",
            subscriptionEndDate: subscription.next_payment || license.expiration,
            billingPeriod: getBillingPeriod(subscription.billing_cycle),
            freemius: {
              userId: user.id,
              subscriptionId: subscription.id,
              billingPeriod: getBillingPeriod(subscription.billing_cycle),
            },
          });
          // TODO: Update user role to premium
          console.log("User subscription updated");
        } else {
          console.log("⚠️ No Strapi user found for Freemius ID:", user.id);
        }

        break;
      }

      case "subscription.cancelled": {
        console.log("❌ SUBSCRIPTION CANCELLED");
        console.log("Freemius User ID:", user.id);
        console.log("User Email:", user.email);
        console.log("Cancelled At:", subscription.canceled_at);
        console.log("Still Active Until:", subscription.next_payment);

        // Find user and mark as cancelled (still active until end date)
        const cancelledUser = await findUserByFreemiusId(user.id);
        if (cancelledUser) {
          await updateUserSubscription(cancelledUser.id, {
            subscriptionStatus: "cancelled",
            // Keep role as premium until subscriptionEndDate
          });
          console.log("User marked as cancelled");
        }

        break;
      }

      case "subscription.renewal.failed.last": {
        console.log("💀 SUBSCRIPTION ENDED - FINAL RENEWAL FAILED");
        console.log("Freemius User ID:", user.id);
        console.log("User Email:", user.email);

        // Set user back to free
        const expiredUser = await findUserByFreemiusId(user.id);
        if (expiredUser) {
          await updateUserSubscription(expiredUser.id, {
            subscriptionStatus: "expired",
            subscriptionEndDate: null,
            billingPeriod: null,
          });
          // TODO: Update user role to free/authenticated
          console.log("User subscription expired");
        }

        break;
      }

      case "subscription.renewal.retry": {
        console.log("🔄 SUBSCRIPTION RENEWAL RETRY");
        console.log("Freemius User ID:", user.id);
        console.log("User Email:", user.email);
        // Just log, no action needed yet
        break;
      }

      default: {
        console.log("ℹ️ UNHANDLED EVENT TYPE:", type);
        break;
      }
    }

    return NextResponse.json({ received: true, type });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Helper functions

function getBillingPeriod(billingCycle: number): string {
  switch (billingCycle) {
    case 1:
      return "monthly";
    case 12:
      return "annual";
    case 0:
      return "lifetime";
    default:
      return "monthly";
  }
}

async function findUserByFreemiusId(freemiusUserId: string) {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.usersList({
      filters: {
        freemius: {
          userId: {
            $eq: freemiusUserId,
          },
        },
      },
    });

    const users = response.data;
    return users[0] || null;
  } catch (error) {
    console.error("Failed to find user:", error);
    return null;
  }
}

interface SubscriptionUpdate {
  subscriptionStatus?: "active" | "cancelled" | "expired";
  subscriptionEndDate?: string | null;
  billingPeriod?: string | null;
  freemius?: {
    userId: string;
    subscriptionId?: string;
    billingPeriod?: string;
  };
}

async function updateUserSubscription(
  strapiUserId: number,
  data: SubscriptionUpdate
) {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: strapiUserId },
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    return null;
  }
}
