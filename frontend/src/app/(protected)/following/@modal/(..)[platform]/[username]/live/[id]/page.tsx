import { VideoModalByFollower } from "@/app/(protected)/[platform]/[username]/live/[id]/_components/video-modal-by-follower";
import { getRecordingsWithPrevNextByFollower } from "@/app/actions/recordings";

interface PageProps {
  params: Promise<{
    id: string;
    username: string;
    platform: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id, username, platform } = await params;
  const { sources, prevId, nextId } = await getRecordingsWithPrevNextByFollower(
    {
      id,
    }
  );

  return (
    <VideoModalByFollower
      initialId={id}
      username={username}
      platform={platform}
      initialSources={sources}
      initialPrevId={prevId}
      initialNextId={nextId}
    />
  );
}
