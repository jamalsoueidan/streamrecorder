"use client";

import dayjs from "@/app/lib/dayjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

const SESSION_GAP_MINUTES = 10;

type IsNewContextValue = {
  isNew: (item: { createdAt?: string | null }) => boolean;
};

const IsNewContext = createContext<IsNewContextValue | null>(null);

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return localStorage.getItem("session-started");
}

function getServerSnapshot() {
  return null;
}

export function IsNewProvider({ children }: { children: React.ReactNode }) {
  const sessionStartedAt = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Defer "is new" detection until after the first client paint so the
  // server-rendered HTML (which never sees localStorage) matches the
  // initial client render. Without this gate, recordings flagged as new
  // appear on the client but not on the server, shifting badge positions
  // and triggering a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const now = dayjs();
    const nowStr = now.toISOString();
    const storedLastVisited = localStorage.getItem("last-visited");
    const storedSessionStarted = localStorage.getItem("session-started");

    if (!storedLastVisited) {
      localStorage.setItem("session-started", nowStr);
      localStorage.setItem("last-visited", nowStr);
    } else if (!storedSessionStarted) {
      localStorage.setItem("session-started", storedLastVisited);
      localStorage.setItem("last-visited", nowStr);
    } else {
      const gap = now.diff(dayjs(storedLastVisited), "minute");
      if (gap > SESSION_GAP_MINUTES) {
        localStorage.setItem("session-started", storedLastVisited);
      }
      localStorage.setItem("last-visited", nowStr);
    }
  }, []);

  const isNew = useCallback(
    (item: { createdAt?: string | null }) => {
      if (!mounted || !sessionStartedAt || !item.createdAt) return false;
      return dayjs(item.createdAt).isAfter(dayjs(sessionStartedAt));
    },
    [sessionStartedAt, mounted],
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
