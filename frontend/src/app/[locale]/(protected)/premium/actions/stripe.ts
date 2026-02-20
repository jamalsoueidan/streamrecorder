"use server";

import { getRoleIdByName } from "@/app/api/freemius/utils";
import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface ActivateStripeResult {
  success: boolean;
  error?: string;
}

export async function activateStripePremium(
  sessionId: string,
): Promise<ActivateStripeResult> {
  try {
    // Get logged-in user
    const currentUser =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!currentUser?.data?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const user = currentUser.data as {
      id: number;
      stripe?: string;
      subscriptionStatus?: string;
    };

    // Check if user already has an active subscription (replay protection)
    if (user.subscriptionStatus === "active" && user.stripe) {
      const existingStripe = JSON.parse(user.stripe);
      // If already activated with any subscription, skip
      if (existingStripe.subscriptionId) {
        return { success: true }; // Already premium, silently succeed
      }
    }

    // Verify the checkout session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return { success: false, error: "Payment not completed" };
    }

    // Verify session belongs to this user (prevent session sharing)
    if (session.metadata?.userId !== user.id.toString()) {
      return { success: false, error: "Session does not belong to this user" };
    }

    const billingCycle = session.metadata?.billingCycle || "monthly";
    const isLifetime = billingCycle === "lifetime";
    const customerId = session.customer as string;

    // Determine billing period and end date
    let subscriptionEndDate: string | null = null;
    let subscriptionId: string | null = null;

    if (session.subscription && !isLifetime) {
      const subscriptionData = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      subscriptionId = subscriptionData.id;

      // current_period_end is on SubscriptionItem, not Subscription
      const firstItem = subscriptionData.items.data[0];
      if (firstItem?.current_period_end) {
        subscriptionEndDate = new Date(
          firstItem.current_period_end * 1000,
        ).toISOString();
      }
    } else if (isLifetime) {
      // Lifetime = far future date (2099)
      subscriptionEndDate = new Date("2099-12-31T23:59:59Z").toISOString();
      subscriptionId = session.id;
    }

    // Stripe data to store - minimal
    const stripeData = {
      customerId,
      subscriptionId,
    };

    // Get premium role ID
    const premiumRoleId = await getRoleIdByName("premium");
    if (!premiumRoleId) {
      return { success: false, error: "Premium role not found" };
    }

    // Upgrade user to premium
    await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: user.id.toString() },
      {
        role: premiumRoleId,
        subscriptionStatus: "active",
        subscriptionEndDate: subscriptionEndDate,
        billingPeriod: billingCycle,
        paymentProvider: "stripe",
        stripe: JSON.stringify(stripeData),
      } as never,
    );

    return { success: true };
  } catch (error: unknown) {
    console.error("Stripe activation error:", error);
    const err = error as { error?: { message?: string } };
    return {
      success: false,
      error: err?.error?.message || "Failed to activate premium",
    };
  }
}

interface CancelStripeResult {
  success: boolean;
  error?: string;
}

export async function cancelStripeSubscription(): Promise<CancelStripeResult> {
  try {
    // Get logged-in user
    const currentUser =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!currentUser?.data?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const user = currentUser.data as {
      id: number;
      stripe?: string;
    };

    // stripe is stored as stringified JSON
    const stripeData = user.stripe ? JSON.parse(user.stripe) : null;
    const subscriptionId = stripeData?.subscriptionId;

    if (!subscriptionId) {
      return { success: false, error: "No active subscription found" };
    }

    // Cancel subscription at period end (user keeps access until end of billing period)
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

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
    console.error("Stripe cancel error:", error);
    const err = error as { error?: { message?: string } };
    return {
      success: false,
      error: err?.error?.message || "Failed to cancel subscription",
    };
  }
}
