"use client";
import {
  HlsVideo,
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaLoadingIndicator,
  MediaMuteButton,
  MediaPlayButton,
  MediaPosterImage,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "@/app/[locale]/(protected)/components/video/media-chrome";
import { Box } from "@mantine/core";

import "hls-video-element";
import "media-chrome";

interface VideoPlayerProps {
  documentId: string;
  previewUrl: string;
  startTime?: number;
}

export function VideoPlayer({ documentId, previewUrl }: VideoPlayerProps) {
  return (
    <MediaController style={{ height: "70vh", width: "100%" }}>
      <HlsVideo
        src={`/api/playlist/${documentId}`}
        slot="media"
        crossOrigin="anonymous"
        playsInline
        autoPlay
        muted
      >
        <track
          default
          kind="metadata"
          label="thumbnails"
          src={`/api/vtt/${documentId}`}
        />
      </HlsVideo>

      {previewUrl && <MediaPosterImage slot="poster" src={previewUrl} />}

      <MediaLoadingIndicator
        slot="centered-chrome"
        loadingdelay="0"
        style={{ "--media-loading-indicator-transition-delay": "0ms" }}
      />

      <MediaControlBar>
        <MediaPlayButton />
        <MediaTimeRange />
        <MediaTimeDisplay showduration />
        <Box className="volume-hover-container">
          <MediaVolumeRange />
          <MediaMuteButton title="" />
        </Box>
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
}
