"use client";

import { trackEvent } from "@/app/lib/analytics";
import { Button, ButtonProps } from "@mantine/core";
import { useState } from "react";

interface StripePaymentButtonProps extends Omit<ButtonProps, "onClick"> {
  billingCycle: "monthly" | "quarterly" | "annual" | "lifetime";
  planLabel: string;
  userEmail: string;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function StripePaymentButton({
  billingCycle,
  planLabel,
  userEmail,
  userId,
  onSuccess,
  onError,
  children,
  ...buttonProps
}: StripePaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    trackEvent("premium_checkout_opened", {
      plan: planLabel,
      billing_cycle: billingCycle,
      provider: "stripe",
    });

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billingCycle,
          userEmail,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      trackEvent("premium_checkout_error", {
        plan: planLabel,
        provider: "stripe",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      onError?.(error instanceof Error ? error.message : "Failed to start checkout");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} loading={loading} {...buttonProps}>
      {children}
    </Button>
  );
}
