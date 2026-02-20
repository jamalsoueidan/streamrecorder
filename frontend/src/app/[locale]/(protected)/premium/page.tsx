import { redirect } from "next/navigation";
import { activateStripePremium } from "./actions";
import PremiumClient from "./premium-client";

interface PageProps {
  searchParams: Promise<{ success?: string; session_id?: string; canceled?: string }>;
}

export default async function PremiumPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Handle Stripe success redirect - activate server-side before rendering
  if (params.success === "true" && params.session_id) {
    const result = await activateStripePremium(params.session_id);

    if (result.success) {
      // Redirect to clean URL after activation
      redirect("/premium");
    }
    // If failed, still redirect but could add error param
    redirect("/premium?error=activation_failed");
  }

  // Handle canceled checkout
  if (params.canceled === "true") {
    redirect("/premium");
  }

  return <PremiumClient />;
}
