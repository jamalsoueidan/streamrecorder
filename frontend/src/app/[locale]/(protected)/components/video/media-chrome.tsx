// components/media-chrome.tsx
"use client";

import { ComponentProps, forwardRef } from "react";

type MediaProps = ComponentProps<"div"> & Record<string, any>;
type VideoProps = ComponentProps<"video"> & Record<string, any>;

export const MediaController = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-controller ref={ref} suppressHydrationWarning dir="ltr" {...props} />
  ),
);
MediaController.displayName = "MediaController";

export const MediaControlBar = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-control-bar ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaControlBar.displayName = "MediaControlBar";

export const MediaPlayButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-play-button ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaPlayButton.displayName = "MediaPlayButton";

export const MediaMuteButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-mute-button ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaMuteButton.displayName = "MediaMuteButton";

export const MediaVolumeRange = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-volume-range ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaVolumeRange.displayName = "MediaVolumeRange";

export const MediaTimeRange = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-time-range ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaTimeRange.displayName = "MediaTimeRange";

export const MediaTimeDisplay = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-time-display ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaTimeDisplay.displayName = "MediaTimeDisplay";

export const MediaFullscreenButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-fullscreen-button ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaFullscreenButton.displayName = "MediaFullscreenButton";

export const MediaPosterImage = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-poster-image ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaPosterImage.displayName = "MediaPosterImage";

export const MediaSeekBackwardButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-seek-backward-button ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaSeekBackwardButton.displayName = "MediaSeekBackwardButton";

export const MediaSeekForwardButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-seek-forward-button ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaSeekForwardButton.displayName = "MediaSeekForwardButton";

export const MediaPlaybackRateButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-playback-rate-button ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaPlaybackRateButton.displayName = "MediaPlaybackRateButton";

export const MediaLoadingIndicator = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-loading-indicator ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaLoadingIndicator.displayName = "MediaLoadingIndicator";

export const MediaPipButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-pip-button ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaPipButton.displayName = "MediaPipButton";

export const MediaCaptionsButton = forwardRef<HTMLElement, MediaProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <media-captions-button ref={ref} suppressHydrationWarning {...props} />
  ),
);
MediaCaptionsButton.displayName = "MediaCaptionsButton";

// HLS Video element
export const HlsVideo = forwardRef<HTMLVideoElement, VideoProps>(
  (props, ref) => (
    // @ts-expect-error - web component
    <hls-video ref={ref} suppressHydrationWarning {...props} />
  ),
);
HlsVideo.displayName = "HlsVideo";
