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
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "@/app/[locale]/(protected)/components/video/media-chrome";
import { checkVideoAccess } from "@/app/actions/video-access";
import { Box, Flex, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

import "hls-video-element";
import "media-chrome";
import { VideoLoadingOverlay } from "./video-loading-overlay";

interface VideoPlayerProps {
  documentId?: string;
  src: string;
  previewUrl: string;
  thumbnailsUrl?: string;
}

export function VideoPlayer({
  documentId,
  src,
  previewUrl,
  thumbnailsUrl,
}: VideoPlayerProps) {
  const controllerRef = useRef<HTMLElement>(null);

  // Only run access check when a documentId is provided — memes and other
  // direct media URLs reuse this player but don't go through playlist.m3u8.
  const { data: access, isPending } = useQuery({
    queryKey: ["video-access", documentId],
    queryFn: () => checkVideoAccess(documentId!),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
  });
  const canPlay = !documentId || access?.allowed === true;
  const showAccessSpinner = !!documentId && isPending;

  return (
    <>
      <noscript>
        <video
          poster={previewUrl}
          controls
          preload="metadata"
          width="auto"
          height="500px"
        >
          <source src={src} type="application/x-mpegURL" />
        </video>
      </noscript>
      <MediaController
        ref={controllerRef}
        style={{
          width: "100%",
          height: "clamp(250px, 50vh, 70vh)",
          position: "relative",
        }}
      >
        {showAccessSpinner && (
          <Flex
            pos="absolute"
            inset={0}
            justify="center"
            align="center"
            bg="rgba(0,0,0,0.55)"
            style={{ zIndex: 5 }}
          >
            <Loader size="md" color="white" />
          </Flex>
        )}
        {canPlay && <VideoLoadingOverlay containerRef={controllerRef} />}
        {canPlay && (
          <HlsVideo
            src={src}
            slot="media"
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

      <MediaLoadingIndicator
        slot="centered-chrome"
        loadingdelay="0"
        style={{ "--media-loading-indicator-transition-delay": "0ms" }}
      />

      <MediaControlBar>
        <MediaPlayButton />
        <MediaSeekBackwardButton seekoffset="30" />
        <MediaSeekForwardButton seekoffset="30" />
        <MediaTimeRange />
        <MediaTimeDisplay showduration />
        <Box className="volume-hover-container">
          <MediaVolumeRange />
          <MediaMuteButton />
        </Box>
        <MediaFullscreenButton />
      </MediaControlBar>
      </MediaController>
    </>
  );
}
