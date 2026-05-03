"use client";

import { Loader, Stack, Text } from "@mantine/core";
import type { HlsVideoElement } from "hls-video-element";
import { RefObject, useEffect, useState } from "react";

interface Props {
  containerRef?: RefObject<HTMLElement | null>;
  videoRef?: RefObject<HTMLVideoElement | null>;
}

/**
 * Centered spinner + progress text shown only while the video is
 * *actively* doing work:
 *   - metadata/manifest/segments are being fetched
 *   - playback started but hit a waiting/stalled state
 *
 * Hidden when the video is ready (can play) OR when it's idle/paused
 * waiting for the user to tap play (preload="none" case). That way the
 * native poster + play button can show through instead of a forever-
 * spinning loader.
 */
export function VideoLoadIndicator({ containerRef, videoRef }: Props) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Loading");
  const [visible, setVisible] = useState(false);
  const [errored, setErrored] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const findHls = (): HlsVideoElement | null =>
      (containerRef?.current?.querySelector(
        "hls-video",
      ) as HlsVideoElement | null) ?? null;

    const findMedia = (): HTMLVideoElement | null =>
      videoRef?.current ??
      (containerRef?.current?.querySelector(
        "video, hls-video",
      ) as HTMLVideoElement | null) ??
      null;

    let rafId: number | null = null;
    let pollTimer: number | null = null;
    let cleanup: (() => void) | null = null;
    let loadStartedAt: number | null = null;

    const bump = (next: number, label?: string) => {
      setProgress((prev) => (next > prev ? next : prev));
      if (label) setStage(label);
    };

    const stopElapsedTimer = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const tickElapsed = () => {
      if (loadStartedAt === null) {
        rafId = null;
        return;
      }
      setElapsedMs(performance.now() - loadStartedAt);
      rafId = requestAnimationFrame(tickElapsed);
    };

    const startElapsedTimer = () => {
      if (loadStartedAt === null || rafId !== null) return;
      rafId = requestAnimationFrame(tickElapsed);
    };

    const showLoading = (label?: string) => {
      // Clear any stale error from a previous load cycle so the indicator
      // doesn't get stuck on "Failed to load" after a transient failure.
      setErrored(false);
      if (loadStartedAt === null) {
        loadStartedAt = performance.now();
        startElapsedTimer();
      }
      setVisible(true);
      if (label) setStage(label);
    };

    const hide = () => {
      stopElapsedTimer();
      setVisible(false);
      setErrored(false);
      setProgress(0);
      setElapsedMs(0);
      loadStartedAt = null;
    };

    const setup = (media: HTMLVideoElement, hlsEl: HlsVideoElement | null) => {

      // --- native media events -----------------------------------------
      const onLoadStart = () => showLoading("Connecting");
      const onWaiting = () => showLoading("Buffering");
      const onStalled = () => showLoading("Buffering");
      const onLoadedMetadata = () => bump(30, "Metadata loaded");
      const onLoadedData = () => bump(55);
      const onProgress = () => {
        try {
          if (media.buffered.length === 0) return;
          const end = media.buffered.end(media.buffered.length - 1);
          const ahead = end - (media.currentTime || 0);
          bump(55 + Math.min(30, (ahead / 2) * 30));
        } catch {}
      };
      const onCanPlay = () => {
        bump(100, "Ready");
        hide();
      };
      const onPlaying = () => {
        bump(100, "Ready");
        hide();
      };
      const onPause = () => {
        // If we paused mid-load there's no active fetch; hide the spinner
        // so the user can press play again.
        if (media.readyState >= 3) hide();
      };
      const onError = () => {
        setErrored(true);
        setVisible(true);
      };

      media.addEventListener("loadstart", onLoadStart);
      media.addEventListener("waiting", onWaiting);
      media.addEventListener("stalled", onStalled);
      media.addEventListener("loadedmetadata", onLoadedMetadata);
      media.addEventListener("loadeddata", onLoadedData);
      media.addEventListener("progress", onProgress);
      media.addEventListener("canplay", onCanPlay);
      media.addEventListener("playing", onPlaying);
      media.addEventListener("pause", onPause);
      media.addEventListener("error", onError);

      // Already loading at mount time
      if (media.networkState === 2 /* NETWORK_LOADING */ && media.readyState < 3) {
        showLoading("Connecting");
      }
      if (media.readyState >= 3) hide();

      // --- hls.js events (more granular) -------------------------------
      let hlsCleanup: (() => void) | null = null;
      const attachHls = () => {
        const api = hlsEl?.api as unknown as {
          on: (event: string, cb: (...args: unknown[]) => void) => void;
          off: (event: string, cb: (...args: unknown[]) => void) => void;
        } | null | undefined;
        if (!api) return false;

        let fragLoadedCount = 0;

        const onManifestLoading = () => {
          showLoading("Loading manifest");
          bump(8);
        };
        const onManifestLoaded = () => bump(20, "Manifest loaded");
        const onLevelLoaded = () => bump(35, "Playlist loaded");
        const onFragLoading = () => bump(45, "Loading segment");
        const onFragLoadProgress = (...args: unknown[]) => {
          const data = args[1] as
            | { frag?: { loaded?: number; total?: number } }
            | undefined;
          const loaded = data?.frag?.loaded ?? 0;
          const total = data?.frag?.total ?? 0;
          if (total > 0) bump(45 + Math.min(20, (loaded / total) * 20));
        };
        const onFragLoaded = () => {
          fragLoadedCount++;
          bump(fragLoadedCount === 1 ? 70 : 80, "Segment loaded");
        };
        const onFragBuffered = () => bump(90, "Almost ready");
        const onHlsError = () => {
          setErrored(true);
          setVisible(true);
        };

        api.on("hlsManifestLoading", onManifestLoading);
        api.on("hlsManifestLoaded", onManifestLoaded);
        api.on("hlsLevelLoaded", onLevelLoaded);
        api.on("hlsFragLoading", onFragLoading);
        api.on("hlsFragLoadProgress", onFragLoadProgress);
        api.on("hlsFragLoaded", onFragLoaded);
        api.on("hlsFragBuffered", onFragBuffered);
        api.on("hlsError", onHlsError);

        hlsCleanup = () => {
          api.off("hlsManifestLoading", onManifestLoading);
          api.off("hlsManifestLoaded", onManifestLoaded);
          api.off("hlsLevelLoaded", onLevelLoaded);
          api.off("hlsFragLoading", onFragLoading);
          api.off("hlsFragLoadProgress", onFragLoadProgress);
          api.off("hlsFragLoaded", onFragLoaded);
          api.off("hlsFragBuffered", onFragBuffered);
          api.off("hlsError", onHlsError);
        };
        return true;
      };

      let apiPollTimer: number | null = null;
      if (!attachHls() && hlsEl) {
        let tries = 0;
        apiPollTimer = window.setInterval(() => {
          tries++;
          if (attachHls() || tries > 50) {
            if (apiPollTimer) clearInterval(apiPollTimer);
            apiPollTimer = null;
          }
        }, 100);
      }

      return () => {
        media.removeEventListener("loadstart", onLoadStart);
        media.removeEventListener("waiting", onWaiting);
        media.removeEventListener("stalled", onStalled);
        media.removeEventListener("loadedmetadata", onLoadedMetadata);
        media.removeEventListener("loadeddata", onLoadedData);
        media.removeEventListener("progress", onProgress);
        media.removeEventListener("canplay", onCanPlay);
        media.removeEventListener("playing", onPlaying);
        media.removeEventListener("pause", onPause);
        media.removeEventListener("error", onError);
        if (apiPollTimer) clearInterval(apiPollTimer);
        if (hlsCleanup) hlsCleanup();
      };
    };

    const tryStart = () => {
      const media = findMedia();
      if (!media) return false;
      cleanup = setup(media, findHls());
      return true;
    };

    if (!tryStart()) {
      let tries = 0;
      pollTimer = window.setInterval(() => {
        tries++;
        if (tryStart() || tries > 50) {
          if (pollTimer) clearInterval(pollTimer);
          pollTimer = null;
        }
      }, 100);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (pollTimer) clearInterval(pollTimer);
      if (cleanup) cleanup();
    };
  }, [containerRef, videoRef]);

  if (!visible && !errored) return null;

  const pct = Math.floor(progress);
  const seconds = elapsedMs / 1000;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 20,
        pointerEvents: "none",
        textAlign: "center",
      }}
    >
      <Stack align="center" gap={6}>
        {!errored && <Loader size="md" color="white" />}
        <Text
          size="sm"
          fw={600}
          c="white"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
        >
          {errored ? "Failed to load" : `${stage} ${pct}%`}
        </Text>
        {!errored && seconds >= 2 && (
          <Text
            size="xs"
            c="gray.3"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
          >
            {seconds.toFixed(1)}s
          </Text>
        )}
      </Stack>
    </div>
  );
}
