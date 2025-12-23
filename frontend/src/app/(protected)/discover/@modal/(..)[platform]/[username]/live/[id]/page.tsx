import { VideoModalByFollower } from "@/app/(protected)/[type]/[username]/live/[id]/_components/video-modal-by-follower";
import { getRecordingsWithPrevNextByFollower } from "@/app/actions/recordings";

interface PageProps {
  params: Promise<{
    id: string;
    username: string;
    type: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id, username, type } = await params;

  const { sources, prevId, nextId } = await getRecordingsWithPrevNextByFollower(
    {
      id,
    }
  );

  return (
    <VideoModalByFollower
      initialId={id}
      username={username}
      type={type}
      initialSources={sources}
      initialPrevId={prevId}
      initialNextId={nextId}
    />
  );
}
