"use client";

import { useLocalStorage } from "@mantine/hooks";
import { useCallback } from "react";

const MAX_WATCHED = 500;

export function useWatched() {
  const [watched, setWatched] = useLocalStorage<string[]>({
    key: "watched-recordings",
    defaultValue: [],
  });

  const markWatched = useCallback(
    (documentId: string) => {
      setWatched((prev) => {
        if (prev.includes(documentId)) return prev;
        const updated = [documentId, ...prev];
        return updated.slice(0, MAX_WATCHED);
      });
    },
    [setWatched],
  );

  const isWatched = useCallback(
    (documentId: string) => watched.includes(documentId),
    [watched],
  );

  return { watched, markWatched, isWatched };
}
