"use client";

import { Button, Loader, Progress, Stack, Text } from "@mantine/core";
import { RefObject, useEffect, useState } from "react";

type LoadState = "loading" | "buffering" | "playing" | "error";

interface Props {
  containerRef?: RefObject<HTMLElement | null>;
  videoRef?: RefObject<HTMLVideoElement | null>;
}

/**
 * Shows a loading overlay with elapsed-time counter while the video buffers.
 * Hides once playback starts. Escalates message at 3s, 10s, 20s.
 * Pass either `videoRef` (direct) or `containerRef` (will query for video/hls-video).
 */
export function VideoLoadingOverlay({ containerRef, videoRef }: Props) {
  const [state, setState] = useState<LoadState>("loading");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [bufferedPct, setBufferedPct] = useState(0);

  useEffect(() => {
    const media: HTMLVideoElement | null =
      videoRef?.current ??
      (containerRef?.current?.querySelector(
        "video, hls-video",
      ) as HTMLVideoElement | null) ??
      null;
    if (!media) return;

    const startedAt = performance.now();
    let bufferingSince: number | null = startedAt;
    let rafId: number | null = null;

    const tick = () => {
      if (bufferingSince !== null) {
        setElapsedMs(performance.now() - bufferingSince);

        // Update buffered percentage
        try {
          if (media.buffered.length > 0 && media.duration > 0) {
            const end = media.buffered.end(media.buffered.length - 1);
            setBufferedPct(Math.min(100, (end / media.duration) * 100));
          }
        } catch {
          // buffered can throw on certain states
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onPlaying = () => {
      bufferingSince = null;
      setState("playing");
    };

    const onWaiting = () => {
      bufferingSince = performance.now();
      setState("buffering");
    };

    const onError = () => {
      bufferingSince = null;
      setState("error");
    };

    const onCanPlay = () => {
      // canplay fires before playing - don't hide yet, wait for actual play
    };

    media.addEventListener("playing", onPlaying);
    media.addEventListener("waiting", onWaiting);
    media.addEventListener("error", onError);
    media.addEventListener("canplay", onCanPlay);
    media.addEventListener("stalled", onWaiting);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      media.removeEventListener("playing", onPlaying);
      media.removeEventListener("waiting", onWaiting);
      media.removeEventListener("error", onError);
      media.removeEventListener("canplay", onCanPlay);
      media.removeEventListener("stalled", onWaiting);
    };
  }, [containerRef, videoRef]);

  if (state === "playing") return null;

  const seconds = elapsedMs / 1000;

  // Don't show anything in first 500ms (avoid flash on fast loads)
  if (state === "loading" && seconds < 0.5) return null;

  const showTimer = seconds >= 3;
  const showSlowWarning = seconds >= 10;
  const showStuckWarning = seconds >= 20;

  let message = "Loading video…";
  if (state === "buffering") message = "Buffering…";
  if (state === "error") message = "Failed to load. Try refreshing.";
  if (showSlowWarning) message = "Still loading — the server may be slow.";
  if (showStuckWarning)
    message = "This is taking longer than usual. Try reloading.";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        zIndex: 5,
        pointerEvents: state === "error" || showStuckWarning ? "auto" : "none",
      }}
    >
      <Stack align="center" gap="sm" style={{ minWidth: 200 }}>
        {state !== "error" && <Loader size="md" color="white" />}
        <Text size="sm" c="white" ta="center">
          {message}
        </Text>
        {showTimer && state !== "error" && (
          <Text size="xs" c="gray.3">
            {seconds.toFixed(1)}s
          </Text>
        )}
        {bufferedPct > 0 && bufferedPct < 100 && state !== "error" && (
          <Progress
            value={bufferedPct}
            size="sm"
            w={180}
            color="blue.5"
            transitionDuration={200}
          />
        )}
        {(showStuckWarning || state === "error") && (
          <Button
            size="xs"
            variant="white"
            color="dark"
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        )}
      </Stack>
    </div>
  );
}
