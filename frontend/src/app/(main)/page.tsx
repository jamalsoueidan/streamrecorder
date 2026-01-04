import publicApi from "@/lib/public-api";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBrandKick,
  IconBrandPatreon,
  IconBrandTiktok,
  IconBrandTwitch,
  IconBrandYoutube,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { CountryFlag } from "../(protected)/components/country-flag";
import { FollowerTypeIcon } from "../(protected)/components/follower-type";
import { formatDuration } from "../(protected)/components/video/player-utils";

const streamingPlatforms = [
  { icon: IconBrandTiktok, color: "#ff0050", name: "TikTok" },
  { icon: IconBrandTwitch, color: "#9146ff", name: "Twitch" },
  { icon: IconBrandKick, color: "#53fc18", name: "Kick" },
  { icon: IconBrandYoutube, color: "#ff0000", name: "YouTube" },
  { icon: IconBrandPatreon, color: "#ff424d", name: "Patreon" },
];

export default async function LandingPage() {
  const {
    data: { data: followers },
  } = await publicApi.follower.getFollowers({
    "pagination[limit]": 10,
    sort: "createdAt:desc",
    populate: { avatar: true },
  });

  const {
    data: { data: recordings },
  } = await publicApi.recording.getRecordings({
    filters: {
      sources: {
        state: {
          $eq: ["done"],
        },
      },
    },
    "pagination[limit]": 6,
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
        populate: {
          avatar: true,
        },
      },
    },
  });

  return (
    <Container size="lg">
      <Stack align="center">
        <div>
          <Title
            order={1}
            ta="center"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              maxWidth: "800px",
            }}
          >
            Live Stream Recorder
          </Title>
          <Title
            order={1}
            ta="center"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Watch or download anytime.
          </Title>
        </div>

        <Text
          size="xl"
          ta="center"
          c="dimmed"
          maw={600}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            lineHeight: 1.7,
            color: "#94a3b8",
          }}
        >
          {
            "Automatic stream recording for Tiktok. Add your favorite creators — we'll capture every stream and save VODs for you to watch anytime."
          }
        </Text>

        {/* Streaming Platforms */}
        <Stack align="center" gap={12} mt="md">
          <Flex gap={24} align="center" wrap="wrap" justify="center">
            {streamingPlatforms.map((platform) => (
              <Tooltip label={platform.name} key={platform.name} withArrow>
                <div
                  style={{
                    color: platform.color,
                    opacity: 0.7,
                  }}
                >
                  <platform.icon size={120} stroke={1.5} />
                </div>
              </Tooltip>
            ))}
          </Flex>
        </Stack>
      </Stack>

      {/* Platform Preview Section */}
      <div style={{ marginTop: 100 }}>
        <Flex gap={60} align="center" direction={{ base: "column", md: "row" }}>
          <div style={{ flex: 1 }}>
            <Stack gap={24}>
              <div>
                <Title
                  order={2}
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.3rem)",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: "#f1f5f9",
                  }}
                >
                  All Your Recordings
                </Title>
                <Title
                  order={2}
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.3rem)",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  One place
                </Title>
              </div>
              <Text
                size="lg"
                style={{
                  color: "#94a3b8",
                  lineHeight: 1.8,
                }}
              >
                Add streamers from any platform. We record every live stream
                automatically and save the VOD. Come back whenever you are ready
                to watch or download anytime.
              </Text>
            </Stack>
          </div>
          <div style={{ flex: 1 }}>
            <Paper
              style={{
                background:
                  "linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                borderRadius: "24px",
                padding: "8px",
                boxShadow: "0 25px 80px -12px rgba(99, 102, 241, 0.25)",
              }}
            >
              <Image
                src="/desktop.png"
                alt="Platform dashboard preview"
                radius="lg"
                style={{
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.7)",
                }}
              />
            </Paper>
          </div>
        </Flex>
      </div>

      {/* Latest Recordings Section */}
      <div style={{ marginTop: 120 }}>
        <Flex justify="space-between" align="center" mb={40}>
          <Stack gap={8}>
            <Title
              order={2}
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              Latest Recordings
            </Title>
            <Text size="md" c="dimmed">
              Streams recorded in the last 24 hours
            </Text>
          </Stack>
          <Button
            variant="subtle"
            color="gray"
            rightSection={<IconArrowRight size={16} />}
            style={{ color: "#94a3b8" }}
            disabled
          >
            View All
          </Button>
        </Flex>

        <Flex gap={24} wrap="wrap">
          {recordings?.map((recording) => {
            const totalDuration =
              recording.sources?.reduce(
                (sum, s) => sum + (s.duration || 0),
                0
              ) || 0;

            const uri = recording.sources?.length
              ? process.env.NEXT_PUBLIC_S3_URL! +
                recording.sources[recording.sources.length - 1].path
              : null;
            return (
              <div
                key={recording.id}
                style={{
                  flex: "1 1 calc(25% - 18px)",
                  minWidth: "280px",
                  maxWidth: "100%",
                }}
              >
                <Card
                  padding={0}
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Image
                      src={uri + "preview.jpg"}
                      alt={recording.follower?.username}
                      height={160}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                      }}
                    />
                    <Badge
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {recording.follower?.type}
                    </Badge>
                    <Flex
                      align="center"
                      gap={4}
                      style={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        background: "rgba(0, 0, 0, 0.7)",
                        padding: "4px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      <IconClock size={12} color="#fff" />
                      <Text size="xs" c="white">
                        {formatDuration(totalDuration)}
                      </Text>
                    </Flex>
                    <ActionIcon
                      variant="filled"
                      size="xl"
                      radius="xl"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "rgba(99, 102, 241, 0.9)",
                        opacity: 0.9,
                      }}
                    >
                      <IconPlayerPlay size={20} />
                    </ActionIcon>
                  </div>
                  <Stack gap={8} p={16}>
                    <Text
                      fw={600}
                      size="sm"
                      lineClamp={2}
                      style={{ color: "#f1f5f9", lineHeight: 1.4 }}
                    >
                      {recording.follower?.nickname}
                    </Text>
                    <Flex justify="space-between" align="center">
                      <Text size="xs" c="dimmed">
                        {recording.follower?.nickname}
                      </Text>
                    </Flex>
                  </Stack>
                </Card>
              </div>
            );
          })}
        </Flex>
      </div>

      {/* Latest Creators Section */}
      <div style={{ marginTop: 100 }}>
        <Flex justify="space-between" align="center" mb={40}>
          <Stack gap={8}>
            <Title
              order={2}
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              Featured Creators
            </Title>
            <Text size="md" c="dimmed">
              New creators on the platform
            </Text>
          </Stack>
          <Button
            variant="subtle"
            color="gray"
            rightSection={<IconArrowRight size={16} />}
            style={{ color: "#94a3b8" }}
            disabled
          >
            Browse All
          </Button>
        </Flex>

        <Flex gap={20} wrap="wrap">
          {followers?.map((creator) => (
            <div
              key={creator.id}
              style={{
                flex: "1 1 calc(16.666% - 17px)",
                minWidth: "180px",
                maxWidth: "100%",
              }}
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
                  <Box pos="relative">
                    <Avatar
                      src={creator.avatar?.url}
                      size={72}
                      radius="xl"
                      style={{
                        border: "3px solid transparent",
                        background:
                          "linear-gradient(135deg, #6366f1, #a855f7) border-box",
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
                        opacity={0.6}
                        style={{ transform: "translate(-50%, -50%)" }}
                      />
                    )}
                  </Box>
                  <div>
                    <Text fw={600} size="sm" style={{ color: "#f1f5f9" }}>
                      {creator.nickname}
                    </Text>
                    <Text size="xs" c="dimmed">
                      @{creator.username}
                    </Text>
                  </div>

                  <CountryFlag
                    country={creator.country}
                    countryCode={creator.countryCode}
                    size={24}
                  />
                </Stack>
              </Card>
            </div>
          ))}
        </Flex>
      </div>

      {/* CTA Section */}
      <div style={{ marginTop: 120 }}>
        <Paper
          p={60}
          style={{
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: "32px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              height: "200%",
              background:
                "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
              pointerEvents: "none",
            }}
          />
          <Stack
            align="center"
            gap={24}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Title
              order={2}
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              Never Miss a Stream Again
            </Title>
            <Text
              size="lg"
              maw={500}
              style={{ color: "#94a3b8", lineHeight: 1.7 }}
            >
              Sign up free and start recording your favorite creators today.
            </Text>
            <Group gap={16} mt={16}>
              <Button<"a">
                size="lg"
                variant="gradient"
                gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                style={{ fontWeight: 600 }}
                href="/register"
              >
                Get Started Free
              </Button>
            </Group>
          </Stack>
        </Paper>
      </div>
    </Container>
  );
}
