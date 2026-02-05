"use client";

import dayjs from "@/app/lib/dayjs";
import { createContext, useCallback, useContext, useMemo } from "react";

const SESSION_GAP_MINUTES = 10;

type IsNewContextValue = {
  isNew: (item: { updatedAt?: string | null }) => boolean;
};

const IsNewContext = createContext<IsNewContextValue | null>(null);

function initializeSession(): string {
  if (typeof window === "undefined") {
    return new Date().toISOString();
  }

  const now = dayjs();
  const storedLastVisited = localStorage.getItem("last-visited");
  const storedSessionStarted = localStorage.getItem("session-started");

  if (!storedLastVisited) {
    // First time visitor
    const nowStr = now.toISOString();
    localStorage.setItem("session-started", nowStr);
    localStorage.setItem("last-visited", nowStr);
    return nowStr;
  }

  // Migration: user has old lastVisitedAt but no sessionStartedAt
  if (!storedSessionStarted) {
    localStorage.setItem("session-started", storedLastVisited);
    localStorage.setItem("last-visited", now.toISOString());
    return storedLastVisited;
  }

  // Check if this is a new session
  const gap = now.diff(dayjs(storedLastVisited), "minute");

  if (gap > SESSION_GAP_MINUTES) {
    // New session! Move sessionStartedAt to where lastVisitedAt was
    localStorage.setItem("session-started", storedLastVisited);
    localStorage.setItem("last-visited", now.toISOString());
    return storedLastVisited;
  }

  localStorage.setItem("last-visited", now.toISOString());
  return storedSessionStarted;
}

export function IsNewProvider({ children }: { children: React.ReactNode }) {
  const sessionStartedAt = useMemo(() => initializeSession(), []);

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
