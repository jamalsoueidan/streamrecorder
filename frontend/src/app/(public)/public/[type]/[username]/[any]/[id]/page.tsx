import dayjs from "@/app/lib/dayjs";
import { Button, Flex } from "@mantine/core";
import { getRecordingById } from "../../actions/actions";
import { VideoPlayer } from "../../components/video-player";

interface PageProps {
  params: Promise<{
    username: string;
    type: string;
    id: string;
  }>;
}

export default async function VideoPage({ params }: PageProps) {
  const { id, username, type } = await params;

  const data = await getRecordingById(id);

  const sources = data.sources ?? [];
  const lastSource = sources[sources.length - 1];
  const previewUrl = lastSource ? `/media${lastSource.path}screenshot.jpg` : "";

  const duration = sources.reduce(
    (acc, source) => acc + (source.duration || 0),
    0
  );

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${data.follower?.nickname} Stream - ${dayjs(data.createdAt).format(
      "MMM D, YYYY"
    )}`,
    description: `Recorded live stream from ${data.follower?.nickname}`,
    thumbnailUrl: sources?.length
      ? "https://livestreamrecorder.com/media" +
        sources[sources.length - 1].path +
        "screenshot.jpg"
      : null,
    uploadDate: data.createdAt,
    duration: `PT${Math.floor(duration / 60)}M${Math.round(duration % 60)}S`,
    contentUrl: `https://livestreamrecorder.com/${data.follower?.type}/${data.follower?.username}/video/${data.documentId}`,
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
          href={`/${type}/${decodeURIComponent(username)}`}
          variant="subtle"
        >
          &larr; Back to {decodeURIComponent(username)}'s profile
        </Button>

        <VideoPlayer previewUrl={previewUrl} documentId={id} />
      </Flex>
    </>
  );
}
