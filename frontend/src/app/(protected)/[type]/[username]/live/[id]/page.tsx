import { PlayBack } from "@/app/(protected)/_components/video/playback";
import { VideoPlayer } from "@/app/(protected)/_components/video/video-player";
import { getRecordingsWithPrevNext } from "@/app/actions/recordings";
import { Box } from "@mantine/core";

interface PageProps {
  params: Promise<{
    id: string;
    username: string;
    type: string;
  }>;
}

export default async function VideoPage({ params }: PageProps) {
  const { type, id, username } = await params;
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
        basePath={`/${type}/${username}/live`}
      />
    </Box>
  );
}
