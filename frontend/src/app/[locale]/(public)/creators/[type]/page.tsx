import { getSocialUrl } from "@/app/components/open-social";
import PaginationControls from "@/app/components/pagination";
import { generateAvatarUrl } from "@/app/lib/avatar-url";
import { generateProfileUrl } from "@/app/lib/profile-url";
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
import { streamingPlatforms } from "../../page";
import { CreatorsSimpleGrid } from "../components/creators-simple-grid";

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

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type
  );

  const platformName = platform?.name || "All Platforms";
  const isAllPlatforms = type === "all";

  const title = isAllPlatforms
    ? "All Streamers & Creators"
    : `${platformName} Streamers & Creators`;

  const description = isAllPlatforms
    ? "Browse all streamers and creators we're recording. Follow your favorites and never miss a live stream from TikTok, Twitch, and more."
    : `Discover ${platformName} streamers and creators. Follow your favorites and we'll automatically record their live streams so you never miss a moment.`;

  return {
    title,
    description,
    keywords: [
      `${platformName.toLowerCase()} streamers`,
      `${platformName.toLowerCase()} creators`,
      `${platformName.toLowerCase()} live stream`,
      `record ${platformName.toLowerCase()}`,
      `${platformName.toLowerCase()} vod`,
      "live stream recorder",
      "stream recording",
    ],
    openGraph: {
      title: `${title} | Live Stream Recorder`,
      description,
      url: `https://www.livestreamrecorder.com/creators/${type}`,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${platformName} Streamers & Creators`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Live Stream Recorder`,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://www.livestreamrecorder.com/creators/${type}`,
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { type } = await params;
  const { page } = await searchParams;
  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type
  ) || {
    color: "#ff0050",
    name: "",
    file: "creators.png",
  };

  const {
    data: { data: followers, meta },
  } = await publicApi.follower.getFollowers({
    ...(!platform.name ? {} : { filters: { type } }),
    "pagination[pageSize]": 20,
    "pagination[page]": parseInt(page || "1"),
    sort: "createdAt:desc",
    populate: { avatar: true },
  });

  const totalPages = meta?.pagination?.pageCount || 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${platform.name || "All"} Streamers & Creators`,
    description: `Discover ${
      platform.name || "all"
    } streamers and creators. Follow your favorites and we'll automatically record their live streams.`,
    url: `https://www.livestreamrecorder.com/creators/${type}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Live Stream Recorder",
      url: "https://www.livestreamrecorder.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: followers?.length || 0,
      itemListElement: followers?.slice(0, 20).map((creator, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Person",
          name: creator.nickname || creator.username,
          alternateName: `@${creator.username}`,
          description: creator.tagline || creator.description,
          image: generateAvatarUrl(creator.avatar?.url, true),
          url: generateProfileUrl(creator, true),
          nationality: creator.country,
          sameAs: [getSocialUrl(creator)],
        },
      })),
    },
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
                No creators yet
              </Title>
              <Text style={{ color: "#64748b" }}>
                Be the first to add a {platform.name} streamer!
              </Text>
              <Button
                component="a"
                href="/register"
                variant="gradient"
                gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                mt="sm"
              >
                Get Started
              </Button>
            </Stack>
          </Paper>
        )}
      </div>
    </>
  );
}
