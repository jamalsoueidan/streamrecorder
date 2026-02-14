import { getSocialUrl } from "@/app/components/open-social";
import PaginationControls from "@/app/components/pagination";
import { generateAvatarUrl } from "@/app/lib/avatar-url";
import { generateProfileUrl } from "@/app/lib/profile-url";
import { generateAlternates } from "@/app/lib/seo";
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
import { CreatorsSimpleGrid } from "../../components/creators-simple-grid";

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
  const t = await getTranslations("creators");

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type,
  );
  const platformKey = platform ? type : "all";

  return {
    title: t(`meta.${platformKey}.title`),
    description: t(`meta.${platformKey}.description`),
    keywords: t.raw(`meta.${platformKey}.keywords`),
    openGraph: {
      title: t(`meta.${platformKey}.title`),
      description: t(`meta.${platformKey}.description`),
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/creators/${type}`,
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
      title: t(`meta.${platformKey}.title`),
      description: t(`meta.${platformKey}.description`),
      images: ["/og-image.png"],
    },
    alternates: generateAlternates(`/creators/${type}`, locale),
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { type } = await params;
  const { page } = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations("creators");

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type,
  ) || {
    color: "#ff0050",
    name: "",
    file: "creators.png",
  };

  const platformKey = platform.name ? type : "all";

  const {
    data: { data: followers, meta },
  } = await publicApi.follower.getFollowers({
    ...(!platform.name ? {} : { filters: { type } }),
    "pagination[pageSize]": 20,
    "pagination[page]": parseInt(page || "1", 10),
    sort: "createdAt:desc",
    populate: { avatar: true },
  });

  const totalPages = meta?.pagination?.pageCount || 1;

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const getCountryName = (countryCode?: string) => {
    if (!countryCode || countryCode === "-") return undefined;
    return regionNames.of(countryCode.toUpperCase());
  };

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
              "@id": `${baseUrl}/creators/${type}`,
              name: t(`hero.title.${platformKey}`),
            },
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: t(`meta.${platformKey}.title`),
        description: t(`meta.${platformKey}.description`),
        url: `${baseUrl}/creators/${type}`,
        isPartOf: {
          "@type": "WebSite",
          name: "Live Stream Recorder",
          url: baseUrl,
        },
        inLanguage: locale,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: followers?.length || 0,
          itemListElement: followers?.slice(0, 20).map((creator, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Person",
              name: creator.username,
              alternateName: [creator.nickname, `@${creator.username}`].filter(Boolean),
              description: creator.tagline || creator.description,
              image: generateAvatarUrl(creator.avatar?.url, true),
              url: generateProfileUrl(creator, true),
              ...(getCountryName(creator.countryCode) && {
                nationality: {
                  "@type": "Country",
                  name: getCountryName(creator.countryCode),
                },
              }),
              sameAs: [getSocialUrl(creator)],
            },
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
      <div style={{ marginTop: 80 }}>
        {followers && followers.length > 0 ? (
          <>
            <CreatorsSimpleGrid followers={followers} />
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
                {t("empty.title")}
              </Title>
              <Text style={{ color: "#64748b" }}>
                {t(`empty.description.${platformKey}`)}
              </Text>
              <Button
                component="a"
                href="/register"
                variant="gradient"
                gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                mt="sm"
              >
                {t("empty.button")}
              </Button>
            </Stack>
          </Paper>
        )}
      </div>
    </>
  );
}
