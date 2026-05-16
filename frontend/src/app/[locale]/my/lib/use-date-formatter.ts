"use client";

import { useFormatter } from "next-intl";
import { useMemo } from "react";
import { useHourCycle } from "./hour-cycle";

// Drop-in replacement for `useFormatter` inside /my/. Identical to the
// next-intl original except that every `dateTime` / `dateTimeRange`
// call has the user's resolved `hourCycle` merged in. The cycle is
// derived server-side in /my/layout.tsx from the user's IANA timezone
// (which <TimezoneCookie/> stores in the `tz` cookie) via the CLDR
// likely-locale data — so en users in the US see 12-hour, en users in
// Turkey see 24-hour, without us hardcoding anything.
export function useDateFormatter() {
  const format = useFormatter();
  const hourCycle = useHourCycle();

  return useMemo(() => {
    if (!hourCycle) return format;
    const inject = (
      original: (...args: unknown[]) => string,
      args: unknown[],
    ) => {
      // The optional inline options object is always the last argument.
      // Inject hourCycle only when it's actually an options object —
      // Date is also `typeof === "object"`, so a no-options call like
      // `dateTime(date)` or `dateTimeRange(start, end)` must NOT have
      // its date arg spread into `{ ...date, hourCycle }` (Date spreads
      // to `{}`, wiping the argument). Named-format strings are passed
      // through unchanged.
      const lastIdx = args.length - 1;
      const last = args[lastIdx];
      const isOptionsObject =
        last !== null &&
        typeof last === "object" &&
        !(last instanceof Date) &&
        !Array.isArray(last);
      if (isOptionsObject) {
        args[lastIdx] = { ...(last as Record<string, unknown>), hourCycle };
      }
      return original(...args);
    };
    return new Proxy(format, {
      get(target, prop, receiver) {
        if (prop === "dateTime" || prop === "dateTimeRange") {
          const original = (target as Record<string, unknown>)[
            prop as string
          ] as (...args: unknown[]) => string;
          return (...args: unknown[]) =>
            inject(original.bind(target), args);
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }, [format, hourCycle]);
}
