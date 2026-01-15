import PaginationControls from "@/app/components/pagination";
import dayjs from "@/app/lib/dayjs";
import { generateProfileUrl } from "@/app/lib/profile-url";
import publicApi from "@/lib/public-api";
import { Center } from "@mantine/core";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import { RecordingsSimpleGrid } from "../components/recordings-simple-grid";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type } = await params;
  const t = await getTranslations("recordings");

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type
  );

  const platformName = platform?.name || "All Platforms";
  const metaKey = type === "all" ? "all" : type;

  const title = t(`meta.${metaKey}.title`);
  const description = t(`meta.${metaKey}.description`);

  return {
    title,
    description,
    keywords: [
      `${platformName.toLowerCase()} recordings`,
      `${platformName.toLowerCase()} live stream`,
      `record ${platformName.toLowerCase()} streams`,
      `${platformName.toLowerCase()} vod`,
      "live stream recorder",
      "stream recording",
    ],
    openGraph: {
      title,
      description,
      url: `https://www.livestreamrecorder.com/recordings/${type}`,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${platformName} Live Stream Recordings`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://www.livestreamrecorder.com/recordings/${type}`,
    },
  };
}

export default async function RecordingTypePage({
  params,
  searchParams,
}: PageProps) {
  const { type } = await params;
  const { page } = await searchParams;
  const t = await getTranslations("recordings");

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type
  ) || {
    color: "#ff0050",
    name: "",
    file: "creators.png",
  };

  const platformName = platform.name || "All";

  const {
    data: { data: recordings, meta },
  } = await publicApi.recording.getRecordings({
    filters: {
      ...(type === "all"
        ? {}
        : {
            follower: {
              type,
            },
          }),
      sources: {
        state: {
          $eq: ["done"],
        },
      },
    },
    "pagination[pageSize]": 20,
    "pagination[page]": parseInt(page || "1"),

    sort: "createdAt:desc",
    populate: {
      sources: {
        fields: ["*"],
        filters: {
          state: {
            $eq: "done",
          },
        },
      },
      follower: {
        fields: ["*"],
      },
    },
  });

  const totalPages = meta?.pagination?.pageCount || 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("jsonLd.name", { platform: platformName }),
    description: t("jsonLd.description", { platform: platformName }),
    url: `https://www.livestreamrecorder.com/recordings/${type}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Live Stream Recorder",
      url: "https://www.livestreamrecorder.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: recordings?.length || 0,
      itemListElement: recordings?.slice(0, 10).map((recording, index) => {
        const duration =
          recording.sources?.reduce((sum, s) => sum + (s.duration || 0), 0) ||
          0;

        const nickname =
          recording.follower?.nickname ||
          recording.follower?.username ||
          "Unknown";
        const recordingDate = dayjs(recording.createdAt).format("MMM D, YYYY");

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VideoObject",
            name: t("jsonLd.streamTitle", {
              nickname,
              date: recordingDate,
            }),
            description: t("jsonLd.streamDescription", {
              nickname,
              platform: recording.follower?.type || "unknown platform",
            }),
            thumbnailUrl: recording.sources?.length
              ? `https://www.livestreamrecorder.com/media${
                  recording.sources[recording.sources.length - 1].path
                }screenshot.jpg`
              : undefined,
            uploadDate: recording.createdAt,
            duration: `PT${Math.floor(duration / 60)}M${Math.round(
              duration % 60
            )}S`,
            contentUrl:
              generateProfileUrl(recording.follower, true) +
              `/video/${recording.documentId}`,
          },
        };
      }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ marginTop: 60 }}>
        <RecordingsSimpleGrid recordings={recordings} />
        {totalPages > 1 && (
          <Center mt={40}>
            <PaginationControls total={totalPages} size="lg" />
          </Center>
        )}
      </div>
    </>
  );
}
