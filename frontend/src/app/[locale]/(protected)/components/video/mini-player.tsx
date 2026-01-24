"use client";

import "hls-video-element";
import "media-chrome";
import { useRef } from "react";
import {
  HlsVideo,
  MediaControlBar,
  MediaController,
  MediaTimeRange,
} from "./media-chrome";

interface Props {
  documentId: string;
  onTimeClick?: (currentTime: number) => void;
}

export function MiniPlayer({ documentId, onTimeClick }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    // hls-video element has currentTime directly on it
    const currentTime = (videoRef.current as any)?.currentTime || 0;
    onTimeClick?.(currentTime);
  };

  return (
    <MediaController
      onClick={handleClick}
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
        borderRadius: 8,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <HlsVideo
        ref={videoRef}
        src={`/video/${documentId}/playlist.m3u8?quality=small`}
        slot="media"
        muted
        loop
        playsInline
        autoPlay
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />

      <MediaControlBar
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          right: 8,
          background: "transparent",
        }}
      >
        <MediaTimeRange style={{ width: "100%" }} />
      </MediaControlBar>
    </MediaController>
  );
}
