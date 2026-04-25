"use client";

import { checkVideoAccess } from "@/app/actions/video-access";
import { useQuery } from "@tanstack/react-query";
import "hls-video-element";
import "media-chrome";
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
} from "./media-chrome";

interface Props {
  documentId: string;
}

export function MiniPlayer({ documentId }: Props) {
  // Prime the view_session cookie so the click-to-play works without
  // an extra round trip. Dedupes with any parent access-check query.
  useQuery({
    queryKey: ["video-access", documentId],
    queryFn: () => checkVideoAccess(documentId),
    staleTime: 5 * 60 * 1000,
  });
  return (
    <>
      <style>{`
        /* Hide play button when playing */
        media-controller:not([mediapaused]) media-play-button[slot="centered-chrome"] {
          display: none !important;
        }
        /* Hide loading indicator when paused (including before first play) */
        media-controller[mediapaused] media-loading-indicator[slot="centered-chrome"] {
          display: none !important;
        }
      `}</style>
      <MediaController
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 8,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <HlsVideo
          src={`/video/${documentId}/playlist.m3u8`}
          slot="media"
          muted
          loop
          playsInline
          preload="none"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />

        <MediaPosterImage
          slot="poster"
          src={`/video/${documentId}/screenshot.jpg`}
        />

        {/* Play button - shows when paused, hides when playing */}
        <MediaPlayButton
          slot="centered-chrome"
          style={{
            "--media-button-icon-height": "64px",
            "--media-button-icon-width": "64px",
          }}
        />

        {/* Loading indicator - only shows when loading AND not paused */}
        <MediaLoadingIndicator slot="centered-chrome" />

        <MediaControlBar>
          <MediaTimeRange />
          <MediaTimeDisplay showduration />

          <div className="volume-hover-container">
            <MediaVolumeRange />
            <MediaMuteButton title="" />
          </div>
          <MediaFullscreenButton />
        </MediaControlBar>
      </MediaController>
    </>
  );
}
