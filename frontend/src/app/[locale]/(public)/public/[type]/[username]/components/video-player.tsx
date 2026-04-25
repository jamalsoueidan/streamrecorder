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
import { checkVideoAccess, VideoAccessResult } from "@/app/actions/video-access";
import { Box, Button, Flex, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

  // Plain useEffect-based access check — the public route tree doesn't
  // mount QueryClientProvider, so we can't useQuery here. Memes and other
  // direct media URLs omit documentId and skip the check entirely.
  const [access, setAccess] = useState<VideoAccessResult | null>(null);
  const [isPending, setIsPending] = useState<boolean>(!!documentId);

  useEffect(() => {
    if (!documentId) return;
    let cancelled = false;
    setIsPending(true);
    checkVideoAccess(documentId)
      .then((res) => {
        if (!cancelled) {
          setAccess(res);
          setIsPending(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAccess({ allowed: false, reason: "upgrade" });
          setIsPending(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  const canPlay = !documentId || access?.allowed === true;
  const showAccessSpinner = !!documentId && isPending;
  const denialReason =
    !!documentId && access && !access.allowed ? access.reason : null;
  const t = useTranslations("video.accessGate");

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
        {denialReason && (
          <Flex
            pos="absolute"
            inset={0}
            justify="center"
            align="center"
            bg="rgba(0,0,0,0.78)"
            px="md"
            style={{ zIndex: 6, backdropFilter: "blur(4px)" }}
          >
            <Stack align="center" gap="md" maw={400} ta="center">
              <IconLock size={48} color="white" stroke={1.5} />
              <Title order={3} c="white" fw={600}>
                {denialReason === "upgrade"
                  ? t("upgrade.title")
                  : t("signIn.title")}
              </Title>
              <Text c="gray.3" size="sm">
                {denialReason === "upgrade"
                  ? t("upgrade.body")
                  : t("signIn.body")}
              </Text>
              <Group gap="sm" mt="xs">
                {denialReason === "upgrade" ? (
                  <Button component={Link} href="/upgrade" size="md">
                    {t("upgrade.primaryCta")}
                  </Button>
                ) : (
                  <>
                    <Button component={Link} href="/login" size="md">
                      {t("signIn.primaryCta")}
                    </Button>
                    <Button
                      component={Link}
                      href="/register"
                      size="md"
                      variant="white"
                      color="dark"
                    >
                      {t("signIn.secondaryCta")}
                    </Button>
                  </>
                )}
              </Group>
            </Stack>
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
