"use client";

import { ActionIcon, Flex, Group, Modal, ScrollArea } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useGesture } from "@use-gesture/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { VideoPlayer } from "@/app/(protected)/components/video/video-player";
import { fetchRecordings } from "@/app/(protected)/following/actions/fetch-recordings";
import { followingParsers } from "@/app/(protected)/following/lib/search-params";
import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";

export default function RecordingModal() {
  const router = useRouter();
  const params = useParams<{
    id: string;
    username: string;
    type: string;
  }>();
  const searchParams = useSearchParams();

  const [currentId, setCurrentId] = useState(params.id);
  const [filters] = useQueryStates(followingParsers);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["recordings", filters],
      queryFn: ({ pageParam }) => fetchRecordings(filters, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page = 1, pageCount = 0 } = lastPage.meta?.pagination ?? {};
        return page < pageCount ? page + 1 : undefined;
      },
    });

  const recordings = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const currentIndex = useMemo(
    () => recordings.findIndex((r) => r.documentId === currentId),
    [recordings, currentId]
  );

  const currentRecording = recordings[currentIndex];

  const navigateTo = useCallback(
    (index: number) => {
      const recording = recordings[index];
      if (!recording) return;

      const basePath = `/${recording.follower?.type}/${recording.follower?.username}/live/${recording.documentId}`;
      const search = searchParams.toString();
      const url = search ? `${basePath}?${search}` : basePath;

      window.history.replaceState(null, "", url);
      setCurrentId(recording.documentId || "");
    },
    [recordings, searchParams]
  );

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      navigateTo(currentIndex - 1);
    }
  }, [currentIndex, navigateTo]);

  const goToNext = useCallback(() => {
    if (currentIndex < recordings.length - 1) {
      navigateTo(currentIndex + 1);
    }
  }, [currentIndex, recordings.length, navigateTo]);

  // Gesture handling for wheel and drag/swipe
  useGesture(
    {
      onWheel: ({ direction: [, dy], event }) => {
        event.preventDefault();
        if (dy > 0) {
          goToNext();
        } else if (dy < 0) {
          goToPrev();
        }
      },
      onDrag: ({ swipe: [, swipeY] }) => {
        if (swipeY === 1) {
          goToPrev(); // Swipe down = previous
        } else if (swipeY === -1) {
          goToNext(); // Swipe up = next
        }
      },
    },
    {
      target: containerRef,
      wheel: {
        eventOptions: { passive: false },
        threshold: 50,
      },
      drag: {
        threshold: 50,
        swipe: { velocity: 0.1 },
      },
    }
  );

  // Prefetch next page when near end
  useEffect(() => {
    const isNearEnd = currentIndex >= recordings.length - 3;
    if (isNearEnd && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    currentIndex,
    recordings.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext, router]);

  const handleClose = () => {
    router.back();
  };

  if (!currentRecording) {
    return null;
  }

  const sources = currentRecording.sources ?? [];

  return (
    <Modal.Root
      opened={true}
      onClose={handleClose}
      fullScreen
      scrollAreaComponent={ScrollArea.Autosize}
      styles={{
        body: { height: "100%", padding: 0, overflow: "hidden" },
      }}
    >
      <Modal.Content>
        <Modal.Body>
          <Flex
            ref={containerRef}
            h="100vh"
            justify="center"
            align="center"
            pos="relative"
            style={{ touchAction: "none" }}
          >
            <VideoPlayer sources={sources} key={currentRecording.documentId} />

            {/* Close button - top left */}
            <ActionIcon
              variant="filled"
              radius="xl"
              size="xl"
              color="gray"
              onClick={handleClose}
              pos="absolute"
              top={20}
              left={20}
            >
              <IconX />
            </ActionIcon>

            {/* Navigation buttons - right side */}
            <Group
              pos="absolute"
              right={20}
              top="50%"
              style={{ transform: "translateY(-50%)", flexDirection: "column" }}
            >
              {currentIndex !== 0 && (
                <ActionIcon
                  variant="filled"
                  radius="xl"
                  size="xl"
                  color="gray"
                  onClick={goToPrev}
                >
                  <IconChevronUp />
                </ActionIcon>
              )}
              {!(currentIndex === recordings.length - 1 && !hasNextPage) && (
                <ActionIcon
                  variant="filled"
                  radius="xl"
                  size="xl"
                  color="gray"
                  onClick={goToNext}
                  loading={isFetchingNextPage}
                >
                  <IconChevronDown />
                </ActionIcon>
              )}
            </Group>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
