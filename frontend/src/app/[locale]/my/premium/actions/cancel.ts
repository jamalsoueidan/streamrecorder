"use server";

import api from "@/lib/api";
import { cancelStripeSubscription } from "./stripe";

// Generic cancel that detects provider. Freemius removed (provider shut us
// down 2026-05-27); legacy freemius users get pushed to the
// FreemiusShutdownModal which calls downgradeToFree directly.
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
    }

    return {
      success: false,
      error: "Unsupported payment provider. Use the downgrade flow.",
    };
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}
