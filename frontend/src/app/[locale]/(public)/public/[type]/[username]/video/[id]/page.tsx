import { generateProfileUrl } from "@/app/lib/profile-url";
import { Button, Flex, Title } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
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
  const t = await getTranslations("video");
  const { id, username, type } = await params;
  const data = await getRecordingById(id);
  const format = await getFormatter();

  const platformName = type.charAt(0).toUpperCase() + type.slice(1);
  const creatorName =
    data.follower?.nickname || data.follower?.username || username;
  const recordedDate = format.dateTime(new Date(data.createdAt || ""), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

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
  const description = `Watch ${creatorName}'s recorded ${platformName} live stream from ${recordedDate}. Never miss a stream with Live Stream Recorder.`;

  const translation = {
    creatorName,
    recordedDate,
    platform: platformName,
    duration: durationFormatted,
    username,
  };

  return {
    title: t("meta.title", translation),
    description: t("meta.description", translation),
    keywords: t("meta.keywords", translation).split(", "),
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
  const locale = await getLocale();
  const t = await getTranslations("video");
  const data = await getRecordingById(id);
  const format = await getFormatter();
  const sources = data.sources ?? [];
  const lastSource = sources[sources.length - 1];
  const previewUrl = lastSource ? `/media${lastSource.path}screenshot.jpg` : "";

  const duration = sources.reduce(
    (acc, source) => acc + (source.duration || 0),
    0,
  );

  const creatorName =
    data.follower?.nickname || data.follower?.username || "Unknown";
  const recordedDate = format.dateTime(new Date(data.createdAt || ""), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: t("jsonLd.name", { creatorName, recordedDate }),
    description: t("jsonLd.description", { creatorName, recordedDate }),
    thumbnailUrl: sources?.length
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/media${
          sources[sources.length - 1].path
        }screenshot.jpg`
      : null,
    uploadDate: data.createdAt,
    duration: `PT${Math.floor(duration / 60)}M${Math.round(duration % 60)}S`,
    contentUrl: `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/playlist/${data.documentId}.m3u8`,
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
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <Flex gap="xs" justify="center" align="center" direction="column">
        <VideoPlayer previewUrl={previewUrl} documentId={id} />

        <Title order={1} c="dimmed" size="xl" fw="400">
          {t("jsonLd.name", { creatorName, recordedDate })}
        </Title>

        <Button
          component="a"
          href={generateProfileUrl(data.follower)}
          variant="light"
          leftSection={
            locale === "ar" ? (
              <IconArrowRight size={16} />
            ) : (
              <IconArrowLeft size={16} />
            )
          }
        >
          {t("backToProfile", { username: creatorName })}
        </Button>
      </Flex>
    </>
  );
}
