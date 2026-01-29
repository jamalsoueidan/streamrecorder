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
import { useEffect, useRef } from "react";

import "hls-video-element";
import "media-chrome";

// Global set of all video pause functions
const activeVideos = new Set<() => void>();

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
  const controllerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;

    const media = controller.querySelector(
      "video, hls-video",
    ) as HTMLVideoElement;
    if (!media) return;

    const pause = () => media.pause();

    // Register this video
    activeVideos.add(pause);

    // Pause all others when this plays
    const handlePlay = () => {
      activeVideos.forEach((p) => {
        if (p !== pause) p();
      });
    };

    // Pause when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          media.pause();
        }
      },
      { threshold: 0.5 },
    );

    media.addEventListener("play", handlePlay);
    observer.observe(controller);

    return () => {
      activeVideos.delete(pause);
      media.removeEventListener("play", handlePlay);
      observer.disconnect();
    };
  }, []);

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
      ref={controllerRef}
      style={{ width: "100%", height: "clamp(250px, 50vh, 70vh)" }}
    >
      {src.includes(".mp4") ? (
        <video
          src={src}
          slot="media"
          crossOrigin="anonymous"
          playsInline
          preload="metadata"
          poster={previewUrl}
        />
      ) : (
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
      )}

      {previewUrl && <MediaPosterImage slot="poster" src={previewUrl} />}

      {src.includes(".mp4") ? (
        <MediaPlayButton slot="centered-chrome" />
      ) : (
        <MediaLoadingIndicator
          slot="centered-chrome"
          loadingdelay="0"
          style={{ "--media-loading-indicator-transition-delay": "0ms" }}
        />
      )}

      <MediaControlBar>
        {src.includes(".m3u8") ? <MediaPlayButton /> : null}
        <MediaTimeRange />
        {src.includes(".m3u8") ? <MediaTimeDisplay showduration /> : null}
        <Box className="volume-hover-container">
          <MediaVolumeRange />
          <MediaMuteButton />
        </Box>
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
}
