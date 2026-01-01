// components/nav-buttons.tsx
"use client";

import { ActionIcon, Flex } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

interface PlayBackProps {
  prevId: string | null;
  nextId: string | null;
  basePath: string;
  onPrev?: () => void; // Optional callback for modal
  onNext?: () => void; // Optional callback for modal
  loading?: boolean;
}

export function PlayBack({
  prevId,
  nextId,
  basePath,
  onPrev,
  onNext,
  loading = false,
}: PlayBackProps) {
  const router = useRouter();

  const goToPrev = useCallback(() => {
    if (!prevId || loading) return;
    if (onPrev) {
      onPrev(); // Modal: use callback
    } else {
      router.push(`${basePath}/${prevId}`); // Normal: use router
    }
  }, [prevId, loading, onPrev, router, basePath]);

  const goToNext = useCallback(() => {
    if (!nextId || loading) return;
    if (onNext) {
      onNext(); // Modal: use callback
    } else {
      router.push(`${basePath}/${nextId}`); // Normal: use router
    }
  }, [nextId, loading, onNext, router, basePath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") goToPrev();
      if (e.key === "ArrowDown") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  return (
    <Flex
      direction="column"
      gap="md"
      pos="absolute"
      right={20}
      top="50%"
      style={{ transform: "translateY(-50%)", zIndex: 10 }}
    >
      <ActionIcon
        variant="light"
        size="xl"
        radius="xl"
        onClick={goToPrev}
        disabled={!prevId || loading}
        aria-label="Previous video"
      >
        <IconChevronUp size={24} />
      </ActionIcon>
      <ActionIcon
        variant="light"
        size="xl"
        radius="xl"
        onClick={goToNext}
        disabled={!nextId || loading}
        aria-label="Next video"
      >
        <IconChevronDown size={24} />
      </ActionIcon>
    </Flex>
  );
}
