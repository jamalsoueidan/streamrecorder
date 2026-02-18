"use server";

import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { revalidatePath } from "next/cache";

// Freemius API config
const FREEMIUS_API_URL = "https://api.freemius.com/v1";
const FREEMIUS_PRODUCT_ID = process.env.FREEMIUS_PRODUCT_ID;
const FREEMIUS_API_KEY = process.env.FREEMIUS_API_KEY;

// Get role ID by name from Strapi
async function getRoleIdByName(name: string): Promise<number | null> {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.rolesList();
    const roles = response.data?.roles;
    const role = roles?.find(
      (r: { name?: string }) => r.name?.toLowerCase() === name.toLowerCase(),
    );
    return role?.id || null;
  } catch (error) {
    console.error("Failed to fetch role:", error);
    return null;
  }
}

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

    // Get premium role ID
    const premiumRoleId = await getRoleIdByName("premium");
    if (!premiumRoleId) {
      return { success: false, error: "Premium role not found" };
    }

    // Immediately upgrade user to premium + update role
    await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: currentUser.data.id.toString() },
      {
        role: premiumRoleId,
        subscriptionStatus: "active",
        subscriptionEndDate: params.subscriptionEndDate,
        billingPeriod: params.billingPeriod,
        freemius: {
          userId: params.freemiusUserId,
          subscriptionId: params.subscriptionId,
          billingPeriod: params.billingPeriod,
        },
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
      freemius?: { userId?: string; subscriptionId?: string };
    };

    const subscriptionId = user.freemius?.subscriptionId;
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
