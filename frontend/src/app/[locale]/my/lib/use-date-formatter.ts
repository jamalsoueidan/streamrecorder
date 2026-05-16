"use client";

import { useFormatter } from "next-intl";
import { useMemo } from "react";
import { useHourCycle } from "./hour-cycle";

// Drop-in replacement for `useFormatter` inside /my/. Identical to the
// next-intl original except that every `format.dateTime(date, options)`
// call has the user's resolved `hourCycle` merged in. The cycle comes
// from the `hc` cookie that <TimezoneCookie/> writes after reading
// `Intl.DateTimeFormat().resolvedOptions().hourCycle` from the browser
// — so en users in the US see 12-hour, en users in Turkey see 24-hour,
// without us hardcoding anything.
export function useDateFormatter() {
  const format = useFormatter();
  const hourCycle = useHourCycle();

  return useMemo(() => {
    if (!hourCycle) return format;
    return new Proxy(format, {
      get(target, prop, receiver) {
        if (prop !== "dateTime") {
          return Reflect.get(target, prop, receiver);
        }
        return (date: Date | number, options?: unknown) => {
          if (typeof options === "string" || options == null) {
            return target.dateTime(date, options as never);
          }
          const merged = {
            ...(options as Record<string, unknown>),
            hourCycle,
          };
          return target.dateTime(date, merged as never);
        };
      },
    });
  }, [format, hourCycle]);
}
