"use client";

import { createContext, ReactNode, useContext } from "react";
import type { HourCycle } from "./hour-cycle-type";

// Carries the user's resolved hour-cycle preference from /my/ layout
// (where it's read from the `hc` cookie) down to client components that
// format dates. `null` = unknown, callers fall back to the locale default.
const HourCycleContext = createContext<HourCycle | null>(null);

export function HourCycleProvider({
  value,
  children,
}: {
  value: HourCycle | null;
  children: ReactNode;
}) {
  return (
    <HourCycleContext.Provider value={value}>
      {children}
    </HourCycleContext.Provider>
  );
}

export function useHourCycle(): HourCycle | null {
  return useContext(HourCycleContext);
}
