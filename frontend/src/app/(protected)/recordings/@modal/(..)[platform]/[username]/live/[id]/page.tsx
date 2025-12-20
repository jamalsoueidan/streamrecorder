import { VideoModalByRecordings } from "@/app/(protected)/[platform]/[username]/live/[id]/_components/video-modal-by-recordings";
import { getRecordingsWithPrevNext } from "@/app/actions/recordings";

interface PageProps {
  params: Promise<{
    id: string;
    username: string;
    platform: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id, username, platform } = await params;
  const { sources, prevId, nextId } = await getRecordingsWithPrevNext({
    id,
    sort: "createdAt:desc",
  });

  return (
    <VideoModalByRecordings
      initialId={id}
      username={username}
      platform={platform}
      initialSources={sources}
      initialPrevId={prevId}
      initialNextId={nextId}
    />
  );
}
