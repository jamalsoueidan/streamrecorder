import PaginationControls from "@/app/components/pagination";
import { generateProfileUrl } from "@/app/lib/profile-url";
import publicApi from "@/lib/public-api";
import { Center } from "@mantine/core";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { generateAlternates } from "@/app/lib/seo";
import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import { RecordingsSimpleGrid } from "../../components/recordings-simple-grid";

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
  const locale = await getLocale();
  const t = await getTranslations("recordings");

  const metaKey = type === "all" ? "all" : type;

  const title = t(`meta.${metaKey}.title`);
  const description = t(`meta.${metaKey}.description`);

  return {
    title,
    description,
    keywords: t.raw(`meta.${metaKey}.keywords`),
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/recordings/${type}`,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: generateAlternates(`/recordings/${type}`, locale),
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
    (p) => p.name.toLowerCase() === type,
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
    "pagination[page]": parseInt(page || "1", 10),

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": baseUrl,
              name: "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${baseUrl}/recordings/${type}`,
              name: t(`hero.title.${platformName.toLowerCase()}`),
            },
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: t(`jsonLd.name.${platformName.toLowerCase()}`),
        description: t(`jsonLd.description.${platformName.toLowerCase()}`),
        url: `${baseUrl}/recordings/${type}`,
        isPartOf: {
          "@type": "WebSite",
          name: "Live Stream Recorder",
          url: baseUrl,
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: recordings?.length || 0,
          itemListElement: recordings?.slice(0, 10).map((recording, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url:
              generateProfileUrl(recording.follower, true) +
              `/video/${recording.documentId}`,
          })),
        },
      },
    ],
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
