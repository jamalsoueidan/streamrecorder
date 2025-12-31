// components/media-chrome.tsx
"use client";

import { ComponentProps, forwardRef } from "react";

type MediaProps = ComponentProps<"div"> & Record<string, any>;
type VideoProps = ComponentProps<"video"> & Record<string, any>;

export const MediaController = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-controller ref={ref} {...props} />
  )
);
MediaController.displayName = "MediaController";

export const MediaControlBar = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-control-bar ref={ref} {...props} />
  )
);
MediaControlBar.displayName = "MediaControlBar";

export const MediaPlayButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-play-button ref={ref} {...props} />
  )
);
MediaPlayButton.displayName = "MediaPlayButton";

export const MediaMuteButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-mute-button ref={ref} {...props} />
  )
);
MediaMuteButton.displayName = "MediaMuteButton";

export const MediaVolumeRange = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-volume-range ref={ref} {...props} />
  )
);
MediaVolumeRange.displayName = "MediaVolumeRange";

export const MediaTimeRange = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-time-range ref={ref} {...props} />
  )
);
MediaTimeRange.displayName = "MediaTimeRange";

export const MediaTimeDisplay = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-time-display ref={ref} {...props} />
  )
);
MediaTimeDisplay.displayName = "MediaTimeDisplay";

export const MediaFullscreenButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-fullscreen-button ref={ref} {...props} />
  )
);
MediaFullscreenButton.displayName = "MediaFullscreenButton";

export const MediaSeekBackwardButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-seek-backward-button ref={ref} {...props} />
  )
);
MediaSeekBackwardButton.displayName = "MediaSeekBackwardButton";

export const MediaSeekForwardButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-seek-forward-button ref={ref} {...props} />
  )
);
MediaSeekForwardButton.displayName = "MediaSeekForwardButton";

export const MediaPlaybackRateButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-playback-rate-button ref={ref} {...props} />
  )
);
MediaPlaybackRateButton.displayName = "MediaPlaybackRateButton";

export const MediaLoadingIndicator = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-loading-indicator ref={ref} {...props} />
  )
);
MediaLoadingIndicator.displayName = "MediaLoadingIndicator";

export const MediaPipButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-pip-button ref={ref} {...props} />
  )
);
MediaPipButton.displayName = "MediaPipButton";

export const MediaCaptionsButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-captions-button ref={ref} {...props} />
  )
);
MediaCaptionsButton.displayName = "MediaCaptionsButton";

// HLS Video element
export const HlsVideo = forwardRef<HTMLVideoElement, VideoProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <hls-video ref={ref} {...props} />
  )
);
HlsVideo.displayName = "HlsVideo";
