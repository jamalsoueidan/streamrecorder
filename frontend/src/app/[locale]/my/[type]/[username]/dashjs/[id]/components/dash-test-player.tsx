"use client";

import { checkVideoAccess } from "@/app/actions/video-access";
import { Box, Loader, Stack, Text } from "@mantine/core";
import {
  isDASHProvider,
  MediaPlayer,
  MediaProvider,
  Track,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { useEffect, useRef, useState } from "react";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

interface Props {
  documentId: string;
}

type Status =
  | { kind: "loading" }
  | { kind: "denied" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

export function DashTestPlayer({ documentId }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  // Load dashjs lazily client-side (static import crashes SSR — dashjs
  // touches `window` at module eval). We HOLD the MediaPlayer render
  // until dashjs is in state, so onProviderChange can assign
  // `provider.library` SYNCHRONOUSLY (before Vidstack's loader races us
  // to the CDN). dashjsRef survives re-renders.
  const dashjsRef = useRef<typeof import("dashjs") | null>(null);
  const [dashjsReady, setDashjsReady] = useState(false);
  useEffect(() => {
    if (dashjsRef.current) return;
    let cancelled = false;
    import("dashjs").then((mod) => {
      if (cancelled) return;
      dashjsRef.current = mod;
      setDashjsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Verify view access (sets the view_session cookie that manifest.mpd
  // requires).
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

  // Vidstack's DASHProvider defaults to loading dash.js 4.7.4 from a CDN
  // (and our @hevcjs/dashjs-plugin is built against our local dashjs
  // 5.1.1 — version mismatch breaks playback). Override `library`
  // SYNCHRONOUSLY in onProviderChange before any await — otherwise
  // Vidstack races us and pulls the CDN copy. Then attach the HEVC
  // plugin via onInstance for HEVC → H.264 wasm transcode (Chrome/Edge/
  // Safari, not Firefox).
  const onProviderChange = (
    provider: MediaProviderAdapter | null,
    _event: MediaProviderChangeEvent,
  ) => {
    if (!provider || !isDASHProvider(provider)) return;
    // SYNCHRONOUS — dashjs is already loaded (we gate MediaPlayer render
    // on dashjsReady), so this beats Vidstack's loader to the punch.
    if (dashjsRef.current) {
      provider.library = dashjsRef.current as unknown as typeof provider.library;
    }
    provider.onInstance(async (instance) => {
      try {
        const hevcPlugin = await import("@hevcjs/dashjs-plugin");
        const attach = (
          hevcPlugin as {
            attachHevcSupport?: (
              p: unknown,
              cfg: { workerUrl: string; wasmUrl: string },
            ) => Promise<unknown>;
          }
        ).attachHevcSupport;
        if (typeof attach === "function") {
          await attach(instance, {
            workerUrl: "/hevcjs/transcode-worker.js",
            wasmUrl: "/hevcjs/hevc-decode.js",
          });
        }
      } catch (err) {
        console.warn("[dash-test-player] attachHevcSupport failed", err);
      }
    });
  };

  if (status.kind === "loading" || !dashjsReady) {
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
    <Stack gap="xs">
      <MediaPlayer
        src={{
          src: `/my/video/${documentId}/manifest.mpd`,
          type: "application/dash+xml",
        }}
        autoPlay
        muted
        playsInline
        crossOrigin="anonymous"
        onProviderChange={onProviderChange}
        style={{ width: "100%", aspectRatio: "16 / 9", maxHeight: "75vh" }}
      >
        <MediaProvider />
        <Track
          src={`/video/${documentId}/chapters.vtt`}
          kind="chapters"
          lang="en"
          default
        />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </Stack>
  );
}
