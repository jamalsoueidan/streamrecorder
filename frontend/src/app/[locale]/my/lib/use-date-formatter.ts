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
      // The last argument to dateTime/dateTimeRange is the options object
      // (or a named-format string, which we leave alone). Inject hourCycle
      // only when callers passed an inline options object.
      const lastIdx = args.length - 1;
      const last = args[lastIdx];
      if (last && typeof last === "object") {
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
