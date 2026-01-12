import { FollowerTypeText } from "@/app/(protected)/components/follower-type-text";
import { getProfileUrl } from "@/app/(protected)/components/open-social";
import PaginationControls from "@/app/(protected)/components/pagination";
import { formatDuration } from "@/app/(protected)/components/video/player-utils";
import dayjs from "@/app/lib/dayjs";
import { generateProfileUrl } from "@/app/lib/profile-url";
import publicApi from "@/lib/public-api";
import {
  ActionIcon,
  Anchor,
  Badge,
  Card,
  Center,
  Flex,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconClock, IconPlayerPlay } from "@tabler/icons-react";
import { Metadata } from "next";
import { streamingPlatforms } from "../../page";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type } = await params;

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type
  );

  const platformName = platform?.name || "All Platforms";
  const isAllPlatforms = type === "all";

  const title = isAllPlatforms
    ? "All Live Stream Recordings"
    : `${platformName} Live Stream Recordings`;

  const description = isAllPlatforms
    ? "Browse all recorded live streams from TikTok, Twitch, and more. Never miss a stream again — watch your favorite creators anytime."
    : `Never miss a ${platformName} stream again. Watch recorded live streams from your favorite ${platformName} creators anytime, anywhere.`;

  return {
    title,
    description,
    keywords: [
      `${platformName.toLowerCase()} recordings`,
      `${platformName.toLowerCase()} live stream`,
      `record ${platformName.toLowerCase()} streams`,
      `${platformName.toLowerCase()} vod`,
      "live stream recorder",
      "stream recording",
    ],
    openGraph: {
      title: `${title} | Live Stream Recorder`,
      description,
      url: `https://www.livestreamrecorder.com/recordings/${type}`,
      type: "website",
      images: [
        {
          url: "/og-image.png", // Make sure this exists in /public
          width: 1200,
          height: 630,
          alt: `${platformName} Live Stream Recordings`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Live Stream Recorder`,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://www.livestreamrecorder.com/recordings/${type}`,
    },
  };
}

export default async function RecordingTypePage({
  params,
  searchParams,
}: PageProps) {
  const { type } = await params;
  const { page } = await searchParams;

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type
  ) || {
    color: "#ff0050",
    name: "",
    file: "creators.png",
  };

  const {
    data: { data: recordings, meta },
  } = await publicApi.recording.getRecordings({
    filters: {
      ...(type === "all"
        ? {}
        : {
            follower: {
              type,
            },
          }),
      sources: {
        state: {
          $eq: ["done"],
        },
      },
    },
    "pagination[pageSize]": 20,
    "pagination[page]": parseInt(page || "1"),

    sort: "createdAt:desc",
    populate: {
      sources: {
        fields: ["*"],
        filters: {
          state: {
            $eq: "done",
          },
        },
      },
      follower: {
        fields: ["*"],
      },
    },
  });

  const totalPages = meta?.pagination?.pageCount || 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${platform.name || "All"} Live Stream Recordings`,
    description: `Browse recorded live streams from ${
      platform.name || "all platforms"
    }. Never miss a stream again.`,
    url: `https://livestreamrecorder.com/recordings/${type}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Live Stream Recorder",
      url: "https://livestreamrecorder.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: recordings?.length || 0,
      itemListElement: recordings?.slice(0, 10).map((recording, index) => {
        const duration =
          recording.sources?.reduce((sum, s) => sum + (s.duration || 0), 0) ||
          0;

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VideoObject",
            name: `${
              recording.follower?.nickname || recording.follower?.username
            } Creator - ${dayjs(recording.createdAt).format("MMM D, YYYY")}`,
            description: `Recorded live stream from ${
              recording.follower?.nickname || recording.follower?.username
            } on ${recording.follower?.type || "unknown platform"}`,
            thumbnailUrl: recording.sources?.length
              ? `https://www.livestreamrecorder.com/media${
                  recording.sources[recording.sources.length - 1].path
                }screenshot.jpg`
              : undefined,
            uploadDate: recording.createdAt,
            duration: `PT${Math.floor(duration / 60)}M${Math.round(
              duration % 60
            )}S`,
            contentUrl:
              generateProfileUrl(recording.follower) +
              `/video/${recording.documentId}`,
          },
        };
      }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ marginTop: 60 }}>
        <SimpleGrid cols={{ base: 1, sm: 4 }}>
          {recordings?.map((recording) => {
            const totalDuration =
              recording.sources?.reduce(
                (sum, s) => sum + (s.duration || 0),
                0
              ) || 0;

            const uri = recording.sources?.length
              ? "/media" + recording.sources[recording.sources.length - 1].path
              : null;

            return (
              <div key={recording.id}>
                <Anchor
                  href={`${getProfileUrl(recording.follower)}/video/${
                    recording.documentId
                  }`}
                  underline="never"
                >
                  <Card
                    padding={0}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <Image
                        src={uri + "preview.jpg"}
                        alt={recording.follower?.username}
                        height={160}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                        }}
                      />
                      <Badge
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          background: "rgba(0, 0, 0, 0.6)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {recording.follower?.type}
                      </Badge>
                      <Flex
                        align="center"
                        gap={4}
                        style={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          background: "rgba(0, 0, 0, 0.7)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        <IconClock size={12} color="#fff" />
                        <Text size="xs" c="white">
                          {formatDuration(totalDuration)}
                        </Text>
                      </Flex>
                      <ActionIcon
                        variant="filled"
                        size="xl"
                        radius="xl"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "rgba(99, 102, 241, 0.9)",
                          opacity: 0.9,
                        }}
                      >
                        <IconPlayerPlay size={20} />
                      </ActionIcon>
                    </div>
                    <Flex p={16} align="center" justify="space-between">
                      <Stack gap={2}>
                        <Text
                          fw={600}
                          size="sm"
                          lineClamp={2}
                          style={{ color: "#f1f5f9", lineHeight: 1.4 }}
                        >
                          {recording.follower?.nickname || "-"} @
                        </Text>

                        <Text size="xs" c="dimmed">
                          Recorded{" "}
                          <time dateTime={recording.createdAt}>
                            {dayjs(recording.createdAt).format("MMM D, YYYY")}
                          </time>
                        </Text>
                      </Stack>

                      <FollowerTypeText
                        type={recording.follower?.type}
                        w={70}
                      />
                    </Flex>
                  </Card>
                </Anchor>
              </div>
            );
          })}
        </SimpleGrid>
        {totalPages > 1 && (
          <Center mt={40}>
            <PaginationControls total={totalPages} size="lg" />
          </Center>
        )}
      </div>
    </>
  );
}
