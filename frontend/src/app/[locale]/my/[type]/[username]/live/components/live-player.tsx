"use client";

import { Box } from "@mantine/core";
import { useEffect, useRef } from "react";
import "xgplayer/dist/index.min.css";

interface LivePlayerProps {
  src: string;
}

// Live FLV player using xgplayer (built by ByteDance, parent of TikTok).
// Handles Enhanced-FLV with HEVC inside — the format TikTok / Douyin
// serve their lives in. mpegts.js / flv.js choke on TikTok's HVCC
// config record; xgplayer parses it correctly out of the box.
export function LivePlayer({ src }: LivePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let player: { destroy: () => void } | null = null;
    let cancelled = false;

    (async () => {
      // Dynamic import — xgplayer touches `window` on import.
      const [{ default: Player }, { default: FlvPlugin }] = await Promise.all([
        import("xgplayer"),
        import("xgplayer-flv"),
      ]);
      if (cancelled) return;

      const p = new Player({
        el: container,
        url: src,
        isLive: true,
        autoplay: true,
        autoplayMuted: true,
        plugins: [FlvPlugin],
        // Lower-latency live config
        flv: {
          retryCount: 3,
          retryDelay: 1000,
          loadTimeout: 10000,
          targetLatency: 3,
          maxLatency: 6,
          disconnectTime: 6,
        },
        width: "100%",
        height: "100%",
      });

      player = p;
    })();

    return () => {
      cancelled = true;
      if (player) {
        try {
          player.destroy();
        } catch {
          /* best-effort */
        }
      }
    };
  }, [src]);

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
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
}
