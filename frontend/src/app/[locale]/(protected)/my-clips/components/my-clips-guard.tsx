"use client";

import { useAbility } from "@/app/providers/ability-provider";
import { ReactNode } from "react";
import { UpgradeOverlay } from "./upgrade-overlay";

interface Props {
  children: ReactNode;
}

export function MyClipsGuard({ children }: Props) {
  const ability = useAbility();
  const canAccessClips = ability.can("meFind", "Clip");

  if (!canAccessClips) {
    return <UpgradeOverlay />;
  }

  return <>{children}</>;
}
