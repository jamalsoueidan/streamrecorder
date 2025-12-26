import { VideoModalByRecordings } from "@/app/(protected)/[type]/[username]/live/[id]/_components/video-modal-by-recordings";
import { getRecordingsWithPrevNext } from "@/app/actions/recordings";
import { SortOptions } from "@/lib/types/filtering";

interface PageProps {
  params: Promise<{
    id: string;
    username: string;
    type: string;
  }>;
  searchParams: Promise<{
    sort?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id, username, type } = await params;
  const { sort } = await searchParams;

  const { sources, prevId, nextId } = await getRecordingsWithPrevNext({
    id,
    sort: sort as unknown as SortOptions,
  });

  return (
    <VideoModalByRecordings
      initialId={id}
      username={username}
      type={type}
      initialSources={sources}
      initialPrevId={prevId}
      initialNextId={nextId}
    />
  );
}
