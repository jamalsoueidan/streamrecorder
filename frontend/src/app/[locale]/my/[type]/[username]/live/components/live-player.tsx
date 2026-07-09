"use client";

import { Box } from "@mantine/core";
import { useEffect, useRef } from "react";
import "xgplayer/dist/index.min.css";

interface LivePlayerProps {
  src: string;
  format: "flv" | "hls";
}

// Live player using xgplayer (built by ByteDance). FLV path handles
// Enhanced-FLV with HEVC inside — the format TikTok / Douyin
// serve their lives in. mpegts.js / flv.js choke on TikTok's HVCC
// config record; xgplayer-flv parses it correctly out of the box.
// HLS path handles every other platform (Twitch, YouTube, Kick, Bigo,
// AfreecaTV, Pandalive, LiveMe, Twitcasting, etc.) via xgplayer-hls.
export function LivePlayer({ src, format }: LivePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let player: { destroy: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: Player }, { default: Plugin }] = await Promise.all([
        import("xgplayer"),
        format === "flv" ? import("xgplayer-flv") : import("xgplayer-hls"),
      ]);
      if (cancelled) return;

      const liveTuning = {
        retryCount: 3,
        retryDelay: 1000,
        loadTimeout: 10000,
        targetLatency: 3,
        maxLatency: 6,
        disconnectTime: 6,
      };

      const p = new Player({
        el: container,
        url: src,
        isLive: true,
        autoplay: true,
        autoplayMuted: true,
        plugins: [Plugin],
        ...(format === "flv" ? { flv: liveTuning } : { hls: liveTuning }),
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
  }, [src, format]);

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
