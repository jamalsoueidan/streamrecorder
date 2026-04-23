import PaginationControls from "@/app/components/pagination";
import { generateProfileUrl } from "@/app/lib/profile-url";
import { Center } from "@mantine/core";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { generateAlternates } from "@/app/lib/seo";
import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import { getRecordings } from "../../cache";
import { RecordingsSimpleGrid } from "../../components/recordings-simple-grid";

interface PageProps {
  params: Promise<{
    locale: string;
    type: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, type } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "recordings" });

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
  const { locale, type } = await params;
  const { page } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "recordings" });

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type,
  ) || {
    color: "#ff0050",
    name: "",
    file: "creators.png",
  };

  const platformName = platform.name || "All";

  const { recordings, meta } = await getRecordings(
    type,
    parseInt(page || "1", 10),
  );

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
