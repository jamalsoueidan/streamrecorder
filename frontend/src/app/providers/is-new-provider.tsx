"use client";

import dayjs from "@/app/lib/dayjs";
import { useLocalStorage } from "@mantine/hooks";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

const SESSION_GAP_MINUTES = 10;

type IsNewContextValue = {
  isNew: (item: { updatedAt?: string | null }) => boolean;
};

const IsNewContext = createContext<IsNewContextValue | null>(null);

export function IsNewProvider({ children }: { children: React.ReactNode }) {
  const [lastVisitedAt, setLastVisitedAt] = useLocalStorage<string | null>({
    key: "last-visited",
    defaultValue: null,
  });

  const [sessionStartedAt, setSessionStartedAt] = useLocalStorage<
    string | null
  >({
    key: "session-started",
    defaultValue: null,
  });

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const now = dayjs();

    if (!lastVisitedAt) {
      setSessionStartedAt(now.toISOString());
      setLastVisitedAt(now.toISOString());
      return;
    }

    // Migration: user has old lastVisitedAt but no sessionStartedAt
    // Treat as new session, use lastVisitedAt as the baseline
    if (!sessionStartedAt) {
      setSessionStartedAt(lastVisitedAt);
      setLastVisitedAt(now.toISOString());
      return;
    }

    // Check if this is a new session
    const gap = now.diff(dayjs(lastVisitedAt), "minute");

    if (gap > SESSION_GAP_MINUTES) {
      // New session! Move sessionStartedAt to where lastVisitedAt was
      // This means: "show as NEW anything that came after user's last visit"
      setSessionStartedAt(lastVisitedAt);
    }

    setLastVisitedAt(now.toISOString());
  }, [lastVisitedAt, sessionStartedAt, setLastVisitedAt, setSessionStartedAt]);

  const isNew = useCallback(
    (item: { updatedAt?: string | null }) => {
      if (!sessionStartedAt || !item.updatedAt) return false;
      return dayjs(item.updatedAt).isAfter(dayjs(sessionStartedAt));
    },
    [sessionStartedAt],
  );

  return (
    <IsNewContext.Provider value={{ isNew }}>{children}</IsNewContext.Provider>
  );
}

export function useIsNew() {
  const context = useContext(IsNewContext);
  if (!context) {
    throw new Error("useIsNew must be used within an IsNewProvider");
  }
  return context;
}
