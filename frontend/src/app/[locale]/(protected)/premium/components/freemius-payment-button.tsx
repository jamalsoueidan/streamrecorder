"use client";

import { getBillingPeriod } from "@/app/api/freemius/utils";
import { trackEvent } from "@/app/lib/analytics";
import { Button, ButtonProps } from "@mantine/core";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { activatePremium } from "../actions";

interface FSCheckoutHandler {
  open: (options: {
    sandbox?: unknown;
    name?: string;
    billing_cycle?: "monthly" | "annual" | "lifetime";
    licenses?: number;
    trial?: boolean;
    purchaseCompleted?: (response: FreemiusPurchaseResponse) => void;
    success?: () => void;
  }) => void;
}

interface FreemiusPurchaseResponse {
  user: { id: string; email: string };
  purchase: {
    id: string;
    billing_cycle: number;
    next_payment: string;
    license_id: string;
    trial_ends: string | null;
  };
}

declare global {
  interface Window {
    FS: {
      Checkout: new (options: {
        product_id: string;
        plan_id: string;
        public_key: string;
        image?: string;
      }) => FSCheckoutHandler;
    };
  }
}

interface FreemiusPaymentButtonProps extends Omit<ButtonProps, "onClick"> {
  billingCycle: "monthly" | "annual" | "lifetime";
  planLabel: string;
  canUseTrial?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function FreemiusPaymentButton({
  billingCycle,
  planLabel,
  canUseTrial = true,
  onSuccess,
  onError,
  children,
  ...buttonProps
}: FreemiusPaymentButtonProps) {
  const [fsReady, setFsReady] = useState(false);
  const handlerRef = useRef<FSCheckoutHandler | null>(null);
  const router = useRouter();
  const isSandbox = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (fsReady && window.FS) {
      handlerRef.current = new window.FS.Checkout({
        product_id: process.env.NEXT_PUBLIC_FREEMIUS_PRODUCT_ID!,
        plan_id: process.env.NEXT_PUBLIC_FREEMIUS_PLAN_ID!,
        public_key: process.env.NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY!,
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/icon_clean.png`,
      });
    }
  }, [fsReady]);

  const handlePurchase = async () => {
    if (!handlerRef.current) return;

    // Track checkout opened
    trackEvent("premium_checkout_opened", {
      plan: planLabel,
      billing_cycle: billingCycle,
    });

    try {
      // Only fetch sandbox params in development
      let sandbox = undefined;
      if (isSandbox) {
        sandbox = await fetch("/api/freemius/sandbox").then((res) =>
          res.json(),
        );
        console.log("🧪 SANDBOX MODE ENABLED");
      }

      console.log("canUseTrial:", canUseTrial);
      handlerRef.current.open({
        ...(sandbox && { sandbox }),
        name: planLabel,
        billing_cycle: billingCycle,
        licenses: 1,
        trial: canUseTrial ? "paid" : false,
        purchaseCompleted: async (response: FreemiusPurchaseResponse) => {
          console.log("Freemius purchaseCompleted response:", JSON.stringify(response, null, 2));
          console.log("trial_ends:", response.purchase.trial_ends);
          console.log("Is trial:", !!response.purchase.trial_ends);

          const billingPeriod = getBillingPeriod(response.purchase.billing_cycle);

          // Track purchase completed
          trackEvent("premium_purchase_completed", {
            plan: planLabel,
            billing_cycle: billingCycle,
            billing_period: billingPeriod,
          });

          console.log("Activating premium for user:", {
            freemiusUserId: response.user.id,
            subscriptionId: response.purchase.id,
            billingPeriod,
            subscriptionEndDate: response.purchase.next_payment,
          });
          // Activate premium via server action
          // For lifetime, set far-future date since there's no next_payment
          const endDate = billingPeriod === "lifetime"
            ? "2099-12-31T23:59:59Z"
            : response.purchase.next_payment;

          const result = await activatePremium({
            freemiusUserId: response.user.id,
            subscriptionId: response.purchase.id,
            licenseId: response.purchase.license_id,
            billingPeriod,
            subscriptionEndDate: endDate,
            trialEnds: response.purchase.trial_ends,
          });

          if (!result.success) {
            console.error("Failed to activate premium:", result.error);
            trackEvent("premium_activation_failed", {
              plan: planLabel,
              error: result.error || "Unknown error",
            });
            onError?.(result.error || "Failed to activate premium");
          } else {
            trackEvent("premium_activation_success", {
              plan: planLabel,
              billing_cycle: billingCycle,
            });
            router.refresh();
            onSuccess?.();
          }
        },
        success: () => {
          console.log("Checkout closed after successful purchase");
        },
      });
    } catch (error) {
      console.error("Failed to open checkout:", error);
      trackEvent("premium_checkout_error", {
        plan: planLabel,
        error: "Failed to open checkout",
      });
      onError?.("Failed to open checkout");
    }
  };

  return (
    <>
      <Script
        src="https://checkout.freemius.com/js/v1/"
        strategy="afterInteractive"
        onLoad={() => setFsReady(true)}
      />
      <Button onClick={handlePurchase} {...buttonProps}>
        {children}
      </Button>
    </>
  );
}
