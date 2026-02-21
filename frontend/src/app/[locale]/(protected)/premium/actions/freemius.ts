"use server";

import {
  getBillingPeriod,
  getRoleIdByName,
  isLicenseClaimed,
  isSubscriptionClaimed,
} from "@/app/api/freemius/utils";
import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { revalidatePath } from "next/cache";

// Freemius API config
const FREEMIUS_API_URL = "https://api.freemius.com/v1";
const FREEMIUS_PRODUCT_ID = process.env.NEXT_PUBLIC_FREEMIUS_PRODUCT_ID;
const FREEMIUS_API_KEY = process.env.FREEMIUS_API_KEY;

interface ActivatePremiumParams {
  freemiusUserId: string;
  subscriptionId: string;
  licenseId: string;
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

interface FreemiusLicense {
  id: string;
  user_id: string;
  plan_id: string;
  expiration: string;
  is_cancelled: boolean;
}

// Verify subscription exists and is active
async function verifySubscription(subscriptionId: string): Promise<{
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

// Verify license exists and is valid (for lifetime purchases)
async function verifyLicense(licenseId: string): Promise<{
  valid: boolean;
  license?: FreemiusLicense;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${FREEMIUS_API_URL}/products/${FREEMIUS_PRODUCT_ID}/licenses/${licenseId}.json`,
      {
        headers: {
          Authorization: `Bearer ${FREEMIUS_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to verify license:", await response.text());
      return { valid: false, error: "License not found" };
    }

    const data = await response.json();

    // API might return license directly or nested
    const license = (data.license || data) as FreemiusLicense;

    if (!license || !license.id) {
      return { valid: false, error: "Invalid license data" };
    }

    // Check if license is cancelled
    if (license.is_cancelled) {
      return { valid: false, error: "License is cancelled" };
    }

    return { valid: true, license };
  } catch (error) {
    console.error("Error verifying license:", error);
    return { valid: false, error: "Failed to verify license" };
  }
}

export async function activatePremium(
  params: ActivatePremiumParams,
): Promise<ActivatePremiumResult> {
  try {
    // Get logged-in user from their JWT (trusted source)
    const { data: user } =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Get premium role ID
    const premiumRoleId = await getRoleIdByName("premium");
    if (!premiumRoleId) {
      return { success: false, error: "Premium role not found" };
    }

    let billingPeriod = params.billingPeriod;
    let subscriptionEndDate = params.subscriptionEndDate;

    // Lifetime purchases use license verification, subscriptions use subscription verification
    if (params.billingPeriod === "lifetime") {
      // Verify license with Freemius API
      const licenseVerification = await verifyLicense(params.licenseId);
      if (!licenseVerification.valid) {
        return { success: false, error: licenseVerification.error };
      }

      // Check if license is already claimed by another user
      const licenseClaimed = await isLicenseClaimed(params.licenseId, user.id);
      if (licenseClaimed) {
        return { success: false, error: "License already in use" };
      }

      // Lifetime = far future date
      billingPeriod = "lifetime";
      subscriptionEndDate = "2099-12-31T23:59:59Z";
    } else {
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

      // Use verified subscription data
      billingPeriod = getBillingPeriod(subscription.billing_cycle);
      subscriptionEndDate = subscription.next_payment || params.subscriptionEndDate;
    }

    // Upgrade user to premium
    await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: user.id.toString() },
      {
        role: premiumRoleId,
        subscriptionStatus: "active",
        subscriptionEndDate,
        billingPeriod,
        paymentProvider: "freemius",
        freemius: JSON.stringify({
          userId: params.freemiusUserId,
          subscriptionId: params.subscriptionId,
          licenseId: params.licenseId,
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

export async function cancelFreemiusSubscription(): Promise<CancelSubscriptionResult> {
  try {
    // Get logged-in user
    const { data: user } =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!user.id) {
      return { success: false, error: "Not authenticated" };
    }

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

    // Keep access until period ends
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
