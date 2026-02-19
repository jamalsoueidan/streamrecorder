"use server";

import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { revalidatePath } from "next/cache";
import { getRoleIdByName, isSubscriptionClaimed, getBillingPeriod } from "@/app/api/freemius/utils";

// Freemius API config
const FREEMIUS_API_URL = "https://api.freemius.com/v1";
const FREEMIUS_PRODUCT_ID = process.env.NEXT_PUBLIC_FREEMIUS_PRODUCT_ID;
const FREEMIUS_API_KEY = process.env.FREEMIUS_API_KEY;

interface ActivatePremiumParams {
  freemiusUserId: string;
  subscriptionId: string;
  billingPeriod: string;
  subscriptionEndDate: string;
}

interface ActivatePremiumResult {
  success: boolean;
  error?: string;
}

interface FreemiusSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  billing_cycle: number;
  next_payment?: string;
  canceled_at?: string | null;
}

// Verify subscription exists and is active
async function verifySubscription(
  subscriptionId: string,
): Promise<{
  valid: boolean;
  subscription?: FreemiusSubscription;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${FREEMIUS_API_URL}/products/${FREEMIUS_PRODUCT_ID}/subscriptions/${subscriptionId}.json`,
      {
        headers: {
          Authorization: `Bearer ${FREEMIUS_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to verify subscription:", await response.text());
      return { valid: false, error: "Subscription not found" };
    }

    const data = await response.json();

    // API might return subscription directly or nested
    const subscription = (data.subscription || data) as FreemiusSubscription;

    if (!subscription || !subscription.id) {
      return { valid: false, error: "Invalid subscription data" };
    }
    // Check if subscription is cancelled
    if (subscription.canceled_at) {
      return { valid: false, error: "Subscription is cancelled" };
    }

    return { valid: true, subscription };
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return { valid: false, error: "Failed to verify subscription" };
  }
}

export async function activatePremium(
  params: ActivatePremiumParams,
): Promise<ActivatePremiumResult> {
  try {
    // Get logged-in user from their JWT (trusted source)
    const currentUser =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!currentUser?.data?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const user = currentUser.data as { id: number };

    // Verify subscription with Freemius API
    const verification = await verifySubscription(params.subscriptionId);
    if (!verification.valid) {
      return { success: false, error: verification.error };
    }

    const subscription = verification.subscription!;

    // Check if subscription is already claimed by another user
    const alreadyClaimed = await isSubscriptionClaimed(
      subscription.id,
      user.id,
    );
    if (alreadyClaimed) {
      return { success: false, error: "Subscription already in use" };
    }

    // Get premium role ID
    const premiumRoleId = await getRoleIdByName("premium");
    if (!premiumRoleId) {
      return { success: false, error: "Premium role not found" };
    }

    // Determine billing period from verified subscription data
    const billingPeriod = getBillingPeriod(subscription.billing_cycle);

    // Upgrade user to premium using verified data
    // freemius is a Text field containing stringified JSON for $contains search
    await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: user.id.toString() },
      {
        role: premiumRoleId,
        subscriptionStatus: "active",
        subscriptionEndDate:
          subscription.next_payment || params.subscriptionEndDate,
        billingPeriod,
        freemius: JSON.stringify({
          userId: subscription.user_id,
          subscriptionId: subscription.id,
          billingPeriod,
        }),
      } as never,
    );

    revalidatePath("/premium");
    return { success: true };
  } catch (error: unknown) {
    const err = error as { error?: { message?: string } };
    return {
      success: false,
      error: err?.error?.message || "Failed to activate premium",
    };
  }
}

interface CancelSubscriptionResult {
  success: boolean;
  error?: string;
}

export async function cancelSubscription(): Promise<CancelSubscriptionResult> {
  try {
    // Get logged-in user
    const currentUser =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!currentUser?.data?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const user = currentUser.data as {
      id: number;
      freemius?: string;
    };

    // freemius is stored as stringified JSON
    const freemiusData = user.freemius ? JSON.parse(user.freemius) : null;
    const subscriptionId = freemiusData?.subscriptionId;
    if (!subscriptionId) {
      return { success: false, error: "No active subscription found" };
    }

    // Call Freemius API to cancel subscription
    const response = await fetch(
      `${FREEMIUS_API_URL}/products/${FREEMIUS_PRODUCT_ID}/subscriptions/${subscriptionId}.json`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${FREEMIUS_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Freemius cancel error:", error);
      return { success: false, error: "Failed to cancel subscription" };
    }

    // Update user status to cancelled
    await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: user.id.toString() },
      {
        subscriptionStatus: "cancelled",
      } as never,
    );

    revalidatePath("/premium");
    return { success: true };
  } catch (error: unknown) {
    console.error("Cancel subscription error:", error);
    const err = error as { error?: { message?: string } };
    return {
      success: false,
      error: err?.error?.message || "Failed to cancel subscription",
    };
  }
}
