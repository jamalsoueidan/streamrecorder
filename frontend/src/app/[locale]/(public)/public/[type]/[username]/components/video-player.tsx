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
import { isbot } from "isbot";

import "hls-video-element";
import "media-chrome";

interface VideoPlayerProps {
  src: string;
  previewUrl: string;
  thumbnailsUrl?: string;
  userAgent: string;
}

export function VideoPlayer({
  src,
  previewUrl,
  thumbnailsUrl,
  userAgent,
}: VideoPlayerProps) {
  if (isbot(userAgent)) {
    return (
      <video
        poster={previewUrl}
        controls
        preload="metadata"
        width="auto"
        height="500px"
      >
        <source src={src} type="application/x-mpegURL" />
      </video>
    );
  }

  return (
    <MediaController
      style={{ width: "100%", height: "clamp(250px, 50vh, 70vh)" }}
    >
      <HlsVideo
        src={src}
        slot="media"
        crossOrigin="anonymous"
        playsInline
        autoPlay
        muted
        preload="metadata"
        poster={previewUrl}
      >
        {thumbnailsUrl ? (
          <track
            default
            kind="metadata"
            label="thumbnails"
            src={thumbnailsUrl}
          />
        ) : null}
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
          <MediaMuteButton />
        </Box>
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
}
