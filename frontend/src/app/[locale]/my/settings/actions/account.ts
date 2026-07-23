"use server";

import api from "@/lib/api";
import { deleteToken } from "@/lib/token";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateUsername(
  newUsername: string,
): Promise<ActionResult> {
  try {
    await api.user.updateUser({ username: newUsername });

    revalidatePath("/my/settings");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.error?.message || "Failed to update username",
    };
  }
}

export async function deleteAccount(): Promise<ActionResult> {
  try {
    // Cancel any active Stripe subscription BEFORE destroying the account.
    // Otherwise Stripe keeps billing a user who no longer exists: the renewal
    // charges the (now account-less) customer can't stop, and they charge them
    // back — a real source of "product unacceptable"/"subscription cancelled"
    // disputes. Deleting the account = leaving, so cancel immediately.
    // Wrapped in its own try/catch so a Stripe hiccup never blocks the user
    // from deleting their account (a Stripe orphan is recoverable; a blocked
    // deletion is a support ticket).
    try {
      const { data: user } =
        await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});
      const stripeData = user?.stripe ? JSON.parse(user.stripe) : null;
      const subscriptionId = stripeData?.subscriptionId;
      // Only real recurring subscriptions (sub_...). Lifetime/champion stores a
      // checkout-session id here, which has nothing to cancel.
      if (typeof subscriptionId === "string" && subscriptionId.startsWith("sub_")) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        // Explicitly no proration and no final invoice: cancelling on account
        // deletion must never generate a last-minute charge (that would be the
        // very dispute this change exists to prevent). Access simply ends now.
        await stripe.subscriptions.cancel(subscriptionId, {
          prorate: false,
          invoice_now: false,
        });
      }
    } catch (stripeError) {
      console.error(
        "deleteAccount: failed to cancel Stripe subscription (continuing with deletion)",
        stripeError,
      );
    }

    await api.user.destroyUser();
    await deleteToken();

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete account" };
  }
}
