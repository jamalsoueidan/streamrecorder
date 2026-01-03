import dayjs from "@/app/lib/dayjs";
import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useEffect } from "react";

const SESSION_GAP_MINUTES = 180;

export function useIsNew() {
  const [lastVisitedAt, setLastVisitedAt] = useLocalStorage<string>({
    key: "last-visited",
    defaultValue: dayjs().toISOString(),
  });

  useEffect(() => {
    const gap = dayjs().diff(dayjs(lastVisitedAt), "minute");

    if (gap > SESSION_GAP_MINUTES) {
      setLastVisitedAt(dayjs().toISOString());
    }
  }, []);

  const isNew = useCallback(
    (item: { updatedAt?: string | null }) => {
      return item.updatedAt
        ? dayjs(item.updatedAt).isAfter(dayjs(lastVisitedAt))
        : false;
    },
    [lastVisitedAt]
  );

  return { isNew };
}
