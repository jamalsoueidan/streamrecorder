"use client";

import { useAbility } from "@/app/providers/ability-provider";
import { ReactNode } from "react";
import { UpgradeOverlay } from "./upgrade-overlay";

interface Props {
  children: ReactNode;
}

export function AiStudioGuard({ children }: Props) {
  const ability = useAbility();
  const canAccessAi = ability.can("meFind", "AiRequest");

  if (!canAccessAi) {
    return <UpgradeOverlay />;
  }

  return <>{children}</>;
}
