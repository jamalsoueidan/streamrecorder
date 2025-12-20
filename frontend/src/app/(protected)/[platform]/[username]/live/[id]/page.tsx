import api from "@/lib/api";
import { Flex } from "@mantine/core";
import { VideoPlayer } from "./_components/video-player";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LivePage({ params }: PageProps) {
  const { id } = await params;
  const response = await api.recording.getRecordingsId({
    id,
    populate: "*",
  });

  const recording = response.data.data;
  const sources = recording?.sources || [];

  return (
    <Flex h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)">
      <VideoPlayer sources={sources} />
    </Flex>
  );
}
