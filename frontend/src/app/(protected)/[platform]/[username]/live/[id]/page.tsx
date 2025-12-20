import { getRecordingsWithPrevNext } from "@/app/actions/recordings";
import { Box } from "@mantine/core";
import { PlayBack } from "./_components/playback";
import { VideoPlayer } from "./_components/video-player";

interface PageProps {
  params: Promise<{
    id: string;
    username: string;
    platform: string;
  }>;
}

export default async function VideoPage({ params }: PageProps) {
  const { platform, id, username } = await params;
  const { sources, prevId, nextId } = await getRecordingsWithPrevNext({
    id,
    sort: "createdAt:desc",
  });

  return (
    <Box
      h={
        "calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)"
      }
      pos="relative"
    >
      <VideoPlayer sources={sources} />
      <PlayBack
        prevId={prevId}
        nextId={nextId}
        basePath={`/${platform}/${username}/live`}
      />
    </Box>
  );
}
