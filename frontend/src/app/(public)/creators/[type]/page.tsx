import { CountryFlag } from "@/app/(protected)/components/country-flag";
import { FollowerTypeIcon } from "@/app/(protected)/components/follower-type-icon";
import { getProfileUrl } from "@/app/(protected)/components/open-social";
import PaginationControls from "@/app/(protected)/components/pagination";
import publicApi from "@/lib/public-api";
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Center,
  Flex,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCloud,
  IconDeviceTv,
  IconPlayerPlay,
  IconUsers,
} from "@tabler/icons-react";
import { streamingPlatforms } from "../../page";

const features = [
  {
    icon: IconUsers,
    title: "Follow Your Favorite Streamers",
    description:
      "Simply follow the creators you love, and we handle the rest. Our service works around the clock, recording streaming video in the background and making it available on-demand.",
  },
  {
    icon: IconPlayerPlay,
    title: "Watch Anytime, Anywhere",
    description:
      "Busy schedule? Different time zone? No problem. Catch up on live content whenever it suits you. Access your recordings through our built-in player or download them for offline viewing.",
  },
  {
    icon: IconCloud,
    title: "Securely Stored in the Cloud",
    description:
      "Your recorded streams are saved securely on our servers. No storage fees, no lost files - just reliable access to your favorite content whenever you need it.",
  },
  {
    icon: IconDeviceTv,
    title: "One Platform, Every Stream",
    description:
      "Whether you want to record TikTok streams, capture Twitch live broadcasts, or save content from other platforms, our stream recording service has you covered.",
  },
];

interface PageProps {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
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

  return (
    <div style={{ marginTop: 80 }}>
      {followers && followers.length > 0 ? (
        <>
          <Flex gap={20} wrap="wrap">
            {followers.map((creator) => (
              <div
                key={creator.id}
                style={{
                  flex: "1 1 calc(16.666% - 17px)",
                  minWidth: "180px",
                  maxWidth: "220px",
                }}
              >
                <Anchor
                  href={getProfileUrl(creator.username, creator.type)}
                  underline="never"
                >
                  <Card
                    padding={20}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "16px",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <Stack align="center" gap={12}>
                      <div style={{ position: "relative" }}>
                        <Avatar
                          src={creator.avatar?.url}
                          size={72}
                          radius="xl"
                          style={{
                            border: `3px solid ${platform.color}40`,
                          }}
                        />
                        {creator.type && (
                          <FollowerTypeIcon
                            pos="absolute"
                            color="transparent"
                            type={creator.type}
                            top="50%"
                            left="50%"
                            size={40}
                            opacity={0.5}
                            style={{ transform: "translate(-50%, -50%)" }}
                          />
                        )}
                      </div>
                      <div>
                        <Text fw={600} size="sm" style={{ color: "#f1f5f9" }}>
                          {creator.nickname || "unknown"}
                        </Text>
                        <Text size="xs" style={{ color: "#64748b" }}>
                          @{creator.username}
                        </Text>
                      </div>
                      <div style={{ minHeight: 24 }}>
                        {creator.country && (
                          <CountryFlag
                            country={creator.country}
                            countryCode={creator.countryCode}
                            size={20}
                          />
                        )}
                      </div>
                    </Stack>
                  </Card>
                </Anchor>
              </div>
            ))}
          </Flex>

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
  );
}
