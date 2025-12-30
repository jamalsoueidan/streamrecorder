import { VideoModal } from "@/app/(protected)/_components/video/video-modal";
import { exploreDefaultOptions } from "@/app/(protected)/explore/page";
import api from "@/lib/api";
import { SortOptions } from "@/lib/types/filtering";
import { deepMerge } from "@mantine/core";

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
  const { sort = SortOptions.createdAtDesc } = await searchParams; // default this default value is from explore/page.tsx must be equal

  const fetchAction = async (id: string) => {
    "use server";
    const response = await api.recording.getRecordingsId({
      id,
      populate: {
        sources: {
          fields: ["*"],
          populate: {
            videoOriginal: {
              fields: ["*"],
            },
          },
        },
      },
    });

    const recording = response.data.data;
    const currentCreatedAt = recording?.createdAt;
    const sources = recording?.sources || [];

    const isDesc = sort.includes("desc");
    const oppositeSort = isDesc
      ? sort.replace("desc", "asc")
      : sort.replace("asc", "desc");

    const [prevResponse, nextResponse] = await Promise.all([
      // Prev: opposite direction of list
      api.recording.browseRecordings(
        deepMerge(exploreDefaultOptions, {
          filters: {
            createdAt: isDesc
              ? { $gt: currentCreatedAt }
              : { $lt: currentCreatedAt },
          },
          sort: oppositeSort,
          "pagination[limit]": 1,
          fields: "documentId",
        })
      ),
      // Next: same direction as list
      api.recording.browseRecordings(
        deepMerge(exploreDefaultOptions, {
          filters: {
            createdAt: isDesc
              ? { $lt: currentCreatedAt }
              : { $gt: currentCreatedAt },
          },
          sort,
          "pagination[limit]": 1,
          fields: "documentId",
        })
      ),
    ]);

    return {
      sources,
      recording,
      prevId: prevResponse.data.data?.[0]?.documentId || null,
      nextId: nextResponse.data.data?.[0]?.documentId || null,
    };
  };

  const { sources, prevId, nextId } = await fetchAction(id);

  return (
    <VideoModal
      initialId={id}
      username={username}
      type={type}
      initialSources={sources}
      initialPrevId={prevId}
      initialNextId={nextId}
      fetchAction={fetchAction}
    />
  );
}
