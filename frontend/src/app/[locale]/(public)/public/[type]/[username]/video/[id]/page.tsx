import dayjs from "@/app/lib/dayjs";
import { generateProfileUrl } from "@/app/lib/profile-url";
import { Button, Flex } from "@mantine/core";
import { Metadata } from "next";
import { getRecordingById } from "../../actions/actions";
import { VideoPlayer } from "../../components/video-player";

interface PageProps {
  params: Promise<{
    username: string;
    type: string;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, username, type } = await params;
  const data = await getRecordingById(id);

  const platformName = type.charAt(0).toUpperCase() + type.slice(1);
  const creatorName =
    data.follower?.nickname || data.follower?.username || username;
  const recordedDate = dayjs(data.createdAt).format("MMM D, YYYY");

  const sources = data.sources ?? [];
  const lastSource = sources[sources.length - 1];
  const thumbnailUrl = lastSource
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/media${lastSource.path}screenshot.jpg`
    : null;

  const duration = sources.reduce(
    (acc, source) => acc + (source.duration || 0),
    0,
  );
  const durationFormatted = `${Math.floor(duration / 60)}m ${Math.round(
    duration % 60,
  )}s`;

  const title = `${creatorName}'s Stream - ${recordedDate}`;
  const description = `Watch ${creatorName}'s recorded ${platformName} live stream from ${recordedDate}. Duration: ${durationFormatted}. Never miss a stream with Live Stream Recorder.`;

  return {
    title,
    description,
    keywords: [
      `${creatorName} vod`,
      `${creatorName} stream ${recordedDate}`,
      `${creatorName} ${platformName}`,
      `${creatorName} recorded stream`,
      `watch ${creatorName}`,
      `${platformName.toLowerCase()} vod`,
      "live stream recorder",
      "recorded stream",
    ],
    openGraph: {
      title: `${title} | Live Stream Recorder`,
      description,
      type: "video.other",
      url: generateProfileUrl(data.follower, true) + `/video/${id}`,
      siteName: "Live Stream Recorder",
      ...(thumbnailUrl && {
        images: [
          {
            url: thumbnailUrl,
            width: 1280,
            height: 720,
            alt: `${creatorName} stream thumbnail`,
          },
        ],
        videos: [
          {
            url: `${generateProfileUrl(data.follower, true)}/video/${id}`,
            width: 1280,
            height: 720,
            type: "text/html",
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Live Stream Recorder`,
      description,
      ...(thumbnailUrl && {
        images: [thumbnailUrl],
      }),
    },
    alternates: {
      canonical: generateProfileUrl(data.follower, true) + `/video/${id}`,
    },
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;

  const data = await getRecordingById(id);
  const sources = data.sources ?? [];
  const lastSource = sources[sources.length - 1];
  const previewUrl = lastSource ? `/media${lastSource.path}screenshot.jpg` : "";

  const duration = sources.reduce(
    (acc, source) => acc + (source.duration || 0),
    0,
  );

  const creatorName = data.follower?.nickname || data.follower?.username;
  const recordedDate = dayjs(data.createdAt).format("MMM D, YYYY");

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${creatorName} Stream - ${recordedDate}`,
    description: `Recorded live stream from ${creatorName} on ${recordedDate}`,
    thumbnailUrl: sources?.length
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/media${
          sources[sources.length - 1].path
        }screenshot.jpg`
      : null,
    uploadDate: data.createdAt,
    duration: `PT${Math.floor(duration / 60)}M${Math.round(duration % 60)}S`,
    contentUrl: `${generateProfileUrl(data.follower, true)}/video/${
      data.documentId
    }`,
    embedUrl: `${generateProfileUrl(data.follower, true)}/video/${
      data.documentId
    }`,
    publisher: {
      "@type": "Organization",
      name: "Live Stream Recorder",
      url: process.env.NEXT_PUBLIC_BASE_URL,
    },
    ...(data.follower && {
      author: {
        "@type": "Person",
        name: creatorName,
        url: generateProfileUrl(data.follower, true),
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <Flex gap="xs" justify="center" align="center" direction="column">
        <Button
          component="a"
          href={generateProfileUrl(data.follower)}
          variant="subtle"
        >
          &larr; Back to {data.follower?.username} profile
        </Button>

        <VideoPlayer previewUrl={previewUrl} documentId={id} />
      </Flex>
    </>
  );
}
