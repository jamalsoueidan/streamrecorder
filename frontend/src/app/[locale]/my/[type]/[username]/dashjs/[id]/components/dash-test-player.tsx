"use client";

import { checkVideoAccess } from "@/app/actions/video-access";
import { Box, Loader, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

interface Props {
  documentId: string;
}

type Status =
  | { kind: "loading" }
  | { kind: "denied" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

export function DashTestPlayer({ documentId }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  // Step 1: verify the user has access (sets the view_session cookie
  // that the manifest.mpd route requires).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const access = await checkVideoAccess(documentId);
        if (cancelled) return;
        setStatus(access.allowed ? { kind: "ready" } : { kind: "denied" });
      } catch (err) {
        if (cancelled) return;
        setStatus({
          kind: "error",
          message: (err as Error)?.message ?? String(err),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  // Step 2: once access is granted + video element is mounted, init
  // dash.js with the @hevcjs/dashjs-plugin attached. The plugin
  // intercepts MSE and transcodes HEVC → H.264 in a worker via wasm.
  useEffect(() => {
    if (status.kind !== "ready") return;
    const video = videoRef.current;
    if (!video) return;

    type DashPlayer = {
      initialize: (
        video: HTMLVideoElement,
        url: string,
        autoPlay?: boolean,
      ) => void;
      reset: () => void;
      destroy?: () => void;
    };

    let player: DashPlayer | null = null;
    let cancelled = false;

    (async () => {
      const [dashjs, hevcPlugin] = await Promise.all([
        import("dashjs"),
        import("@hevcjs/dashjs-plugin"),
      ]);
      if (cancelled) return;

      const created = dashjs.MediaPlayer().create() as DashPlayer;
      player = created;

      // Attach HEVC support BEFORE initialize so it can hook into MSE.
      try {
        const attach = (
          hevcPlugin as { attachHevcSupport?: (p: DashPlayer) => unknown }
        ).attachHevcSupport;
        if (typeof attach === "function") {
          await attach(created);
        }
      } catch (err) {
        console.warn("[dash-test-player] attachHevcSupport failed", err);
      }

      created.initialize(
        video,
        `/my/video/${documentId}/manifest.mpd`,
        true,
      );
    })();

    return () => {
      cancelled = true;
      try {
        player?.reset();
        player?.destroy?.();
      } catch {
        /* best-effort */
      }
    };
  }, [status, documentId]);

  if (status.kind === "loading") {
    return (
      <Box ta="center" py="xl">
        <Loader />
      </Box>
    );
  }
  if (status.kind === "denied") {
    return <Text c="red">You don&apos;t have access to this recording.</Text>;
  }
  if (status.kind === "error") {
    return <Text c="red">{status.message}</Text>;
  }

  return (
    <Box
      w="100%"
      style={{
        aspectRatio: "16 / 9",
        maxHeight: "75vh",
        background: "#000",
        borderRadius: "var(--mantine-radius-md)",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        controls
        playsInline
        muted
        autoPlay
        crossOrigin="anonymous"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Box>
  );
}
