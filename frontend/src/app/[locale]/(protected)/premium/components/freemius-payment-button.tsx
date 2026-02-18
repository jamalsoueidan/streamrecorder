"use client";

import { Button, ButtonProps } from "@mantine/core";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { activatePremium } from "../actions";

interface FSCheckoutHandler {
  open: (options: {
    sandbox?: unknown;
    name?: string;
    billing_cycle?: "monthly" | "annual" | "lifetime";
    licenses?: number;
    purchaseCompleted?: (response: FreemiusPurchaseResponse) => void;
    success?: () => void;
  }) => void;
}

interface FreemiusPurchaseResponse {
  user: { id: string };
  purchase: {
    subscription_id: string;
    billing_cycle: number;
    next_payment: string;
  };
  license: { expiration: string };
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
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function FreemiusPaymentButton({
  billingCycle,
  planLabel,
  onSuccess,
  onError,
  children,
  ...buttonProps
}: FreemiusPaymentButtonProps) {
  const [fsReady, setFsReady] = useState(false);
  const handlerRef = useRef<FSCheckoutHandler | null>(null);
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

    try {
      // Only fetch sandbox params in development
      let sandbox = undefined;
      if (isSandbox) {
        sandbox = await fetch("/api/freemius/sandbox").then((res) =>
          res.json(),
        );
        console.log("🧪 SANDBOX MODE ENABLED");
      }

      handlerRef.current.open({
        ...(sandbox && { sandbox }),
        name: planLabel,
        billing_cycle: billingCycle,
        licenses: 1,
        purchaseCompleted: async (response: FreemiusPurchaseResponse) => {
          // Map billing cycle number to string
          const billingPeriod =
            response.purchase.billing_cycle === 1
              ? "monthly"
              : response.purchase.billing_cycle === 12
                ? "annual"
                : "lifetime";

          // Activate premium via server action
          const result = await activatePremium({
            freemiusUserId: response.user.id,
            subscriptionId: response.purchase.subscription_id,
            billingPeriod,
            subscriptionEndDate:
              response.purchase.next_payment || response.license.expiration,
          });

          if (!result.success) {
            console.error("Failed to activate premium:", result.error);
            onError?.(result.error || "Failed to activate premium");
          } else {
            onSuccess?.();
          }
        },
        success: () => {
          console.log("Checkout closed after successful purchase");
        },
      });
    } catch (error) {
      console.error("Failed to open checkout:", error);
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
