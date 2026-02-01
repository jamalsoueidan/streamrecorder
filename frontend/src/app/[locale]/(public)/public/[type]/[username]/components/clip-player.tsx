"use client";

import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaPosterImage,
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

interface ClipPlayerProps {
  src: string;
  previewUrl: string;
  subtitlesUrl?: string;
  userAgent?: string;
  locale?: string;
  fit?: boolean;
}

export function ClipPlayer({
  src,
  previewUrl,
  subtitlesUrl,
  userAgent,
  locale,
  fit = false,
}: ClipPlayerProps) {
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

  if (userAgent && isbot(userAgent)) {
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
      style={{
        width: "100%",
        height: fit ? "100%" : "clamp(250px, 50vh, 70vh)",
      }}
    >
      <video
        src={src}
        slot="media"
        crossOrigin="anonymous"
        playsInline
        preload="metadata"
      >
        {subtitlesUrl ? (
          <track
            kind="subtitles"
            src={subtitlesUrl}
            srcLang={locale}
            label={locale === "en" ? "English" : "Subtitles"}
            default
          />
        ) : null}
      </video>

      {previewUrl && <MediaPosterImage slot="poster" src={previewUrl} />}

      <MediaPlayButton slot="centered-chrome" />

      <MediaControlBar>
        <MediaTimeRange />
        <Box className="volume-hover-container">
          <MediaVolumeRange />
          <MediaMuteButton />
        </Box>
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
}
