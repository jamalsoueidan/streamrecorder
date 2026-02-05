"use client";

import dayjs from "@/app/lib/dayjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const SESSION_GAP_MINUTES = 10;

type IsNewContextValue = {
  isNew: (item: { updatedAt?: string | null }) => boolean;
};

const IsNewContext = createContext<IsNewContextValue | null>(null);

export function IsNewProvider({ children }: { children: React.ReactNode }) {
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const now = dayjs();
    const storedLastVisited = localStorage.getItem("last-visited");
    const storedSessionStarted = localStorage.getItem("session-started");

    if (!storedLastVisited) {
      // First time visitor
      localStorage.setItem("session-started", now.toISOString());
      localStorage.setItem("last-visited", now.toISOString());
      setSessionStartedAt(now.toISOString());
      return;
    }

    const lastVisitedAt = storedLastVisited;

    // Migration: user has old lastVisitedAt but no sessionStartedAt
    if (!storedSessionStarted) {
      localStorage.setItem("session-started", lastVisitedAt);
      localStorage.setItem("last-visited", now.toISOString());
      setSessionStartedAt(lastVisitedAt);
      return;
    }

    // Check if this is a new session
    const gap = now.diff(dayjs(lastVisitedAt), "minute");

    if (gap > SESSION_GAP_MINUTES) {
      // New session! Move sessionStartedAt to where lastVisitedAt was
      localStorage.setItem("session-started", lastVisitedAt);
      setSessionStartedAt(lastVisitedAt);
    } else {
      setSessionStartedAt(storedSessionStarted);
    }

    localStorage.setItem("last-visited", now.toISOString());
  }, []);

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
