import PaginationControls from "@/app/components/pagination";
import { generateProfileUrl } from "@/app/lib/profile-url";
import {
  countrySlugToCode,
  getCountryName,
} from "@/app/lib/country-utils";
import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import publicApi from "@/lib/public-api";
import {
  Button,
  Center,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { RecordingsSimpleGrid } from "../../components/recordings-simple-grid";

interface PageProps {
  params: Promise<{
    type: string;
    country: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type, country } = await params;
  const locale = await getLocale();
  const t = await getTranslations("recordings");

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type,
  );
  const platformKey = platform ? type : "all";
  const countryCode = countrySlugToCode(country, locale);
  const countryName = countryCode
    ? getCountryName(countryCode, locale)
    : getCountryName(country, locale);

  const title = t("country.title", {
    platform: t(`hero.title.${platformKey}`),
    country: countryName,
  });
  const description = t("country.description", {
    platform: t(`hero.title.${platformKey}`),
    country: countryName,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/recordings/${type}/${country}`,
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
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/recordings/${type}/${country}`,
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { type, country } = await params;
  const { page } = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations("recordings");

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type,
  ) || {
    color: "#ff0050",
    name: "",
    file: "creators.png",
  };

  const platformKey = platform.name ? type : "all";

  // Convert country slug to ISO code
  const countryCode = countrySlugToCode(country, locale);
  if (!countryCode) {
    notFound();
  }

  const countryName = getCountryName(countryCode, locale);

  const {
    data: { data: recordings, meta },
  } = await publicApi.recording.getRecordings({
    filters: {
      ...(platform.name
        ? {
            follower: {
              type,
              countryCode: countryCode,
            },
          }
        : {
            follower: {
              countryCode: countryCode,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("country.title", {
      platform: t(`hero.title.${platformKey}`),
      country: countryName,
    }),
    description: t("country.description", {
      platform: t(`hero.title.${platformKey}`),
      country: countryName,
    }),
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/recordings/${type}/${country}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Live Stream Recorder",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    },
    inLanguage: locale,
    about: {
      "@type": "Country",
      name: countryName,
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ marginTop: 60 }}>
        {recordings && recordings.length > 0 ? (
          <>
            <RecordingsSimpleGrid recordings={recordings} />
            {totalPages > 1 && (
              <Center mt={40}>
                <PaginationControls total={totalPages} size="lg" />
              </Center>
            )}
          </>
        ) : (
          <Paper
            p="xl"
            radius="lg"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              textAlign: "center",
            }}
          >
            <Stack align="center" gap="md">
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: `${platform.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: platform.color,
                }}
              >
                <Image
                  alt={platform.name}
                  src={platform.file.toLowerCase()}
                  width={100}
                />
              </div>
              <Title order={3} style={{ color: "#f1f5f9" }}>
                {t("country.empty.title")}
              </Title>
              <Text style={{ color: "#64748b" }}>
                {t("country.empty.description", {
                  platform: t(`hero.title.${platformKey}`),
                  country: countryName,
                })}
              </Text>
              <Button
                component="a"
                href="/register"
                variant="gradient"
                gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                mt="sm"
              >
                {t("cta.button")}
              </Button>
            </Stack>
          </Paper>
        )}
      </div>
    </>
  );
}
