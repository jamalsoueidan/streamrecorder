"use client";

import { useLocalStorage } from "@mantine/hooks";
import { useCallback } from "react";

const MAX_DOWNLOADED = 1000;

export function useDownloaded() {
  const [downloaded, setDownloaded] = useLocalStorage<string[]>({
    key: "downloaded-sources",
    defaultValue: [],
  });

  const markDownloaded = useCallback(
    (sourceDocumentId: string) => {
      setDownloaded((prev) => {
        if (prev.includes(sourceDocumentId)) return prev;
        const updated = [sourceDocumentId, ...prev];
        return updated.slice(0, MAX_DOWNLOADED);
      });
    },
    [setDownloaded],
  );

  const isDownloaded = useCallback(
    (sourceDocumentId: string) => downloaded.includes(sourceDocumentId),
    [downloaded],
  );

  const clearDownloaded = useCallback(() => {
    setDownloaded([]);
  }, [setDownloaded]);

  return { downloaded, markDownloaded, isDownloaded, clearDownloaded };
}
