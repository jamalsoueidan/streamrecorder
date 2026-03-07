"use client";

import { useUser } from "@/app/providers/user-provider";
import { useEffect } from "react";
import { unpauseFollowers } from "../actions/unpause-followers";

export function UnpauseFollowers() {
  const user = useUser();

  useEffect(() => {
    if (user?.role?.type && user.role.type !== "authenticated") {
      unpauseFollowers().catch(() => {});
    }
  }, [user?.role?.type]);

  return null;
}
