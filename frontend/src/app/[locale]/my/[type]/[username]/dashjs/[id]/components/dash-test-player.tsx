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
import { useEffect, useState } from "react";

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

  // Vidstack's DASHProvider uses dash.js under the hood — by default it
  // loads dash.js 4.7.4 from a CDN. We pin Vidstack to our local dashjs
  // (which is what @hevcjs/dashjs-plugin is built against) and attach the
  // HEVC plugin so HEVC streams transcode → H.264 in a worker via wasm
  // (Chrome/Edge/Safari, not Firefox).
  const onProviderChange = async (
    provider: MediaProviderAdapter | null,
    _event: MediaProviderChangeEvent,
  ) => {
    if (!provider || !isDASHProvider(provider)) return;
    try {
      const [dashjs, hevcPlugin] = await Promise.all([
        import("dashjs"),
        import("@hevcjs/dashjs-plugin"),
      ]);
      // Force Vidstack to use OUR dashjs build, not the CDN-loaded one.
      // DASHLibrary accepts a namespace export, which is what `import * as`
      // gives us — cast covers a slight shape-mismatch in the .d.ts.
      provider.library = dashjs as unknown as typeof provider.library;
      provider.onInstance((instance) => {
        const attach = (
          hevcPlugin as { attachHevcSupport?: (p: unknown) => unknown }
        ).attachHevcSupport;
        if (typeof attach === "function") attach(instance);
      });
    } catch (err) {
      console.warn("[dash-test-player] attachHevcSupport failed", err);
    }
  };

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
