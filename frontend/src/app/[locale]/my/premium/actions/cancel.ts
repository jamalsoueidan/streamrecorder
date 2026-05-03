"use server";

import api from "@/lib/api";
import { cancelFreemiusSubscription } from "./freemius";
import { cancelStripeSubscription } from "./stripe";

// Generic cancel that detects provider
export async function cancelSubscription(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { data: user } =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const provider = user.paymentProvider;

    if (provider === "stripe") {
      return cancelStripeSubscription();
    } else {
      // Default to freemius for backwards compatibility
      return cancelFreemiusSubscription();
    }
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}
