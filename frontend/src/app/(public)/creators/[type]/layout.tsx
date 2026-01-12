import {
  Badge,
  Button,
  Container,
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
  IconUserPlus,
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
      "Your recorded streams are saved securely on our servers. No storage fees, no lost files, just reliable access to your favorite content whenever you need it.",
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
  children: React.ReactNode;
}

export default async function Page({ params, children }: PageProps) {
  const { type } = await params;

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type
  ) || {
    color: "#ff0050",
    name: "",
    file: "creators.png",
  };

  return (
    <Container size="lg">
      {/* Hero Section */}
      <Stack align="center" gap={24} mb={60}>
        <Title
          order={1}
          ta="center"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            background:
              "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            paddingBottom: "0.1em",
          }}
        >
          {platform.name} Creators
        </Title>

        <Text
          size="xl"
          ta="center"
          maw={600}
          style={{ color: "#94a3b8", lineHeight: 1.7 }}
        >
          Never miss a {platform.name} stream again. We automatically record
          your favorite creators so you can watch anytime.
        </Text>

        <Flex gap={30} align="center" mt={20}>
          {streamingPlatforms.map((p) => (
            <Button
              key={p.name}
              component="a"
              size="xl"
              radius="lg"
              href={`/creators/${p.name.toLowerCase()}`}
              variant={
                p.name.toLowerCase() === type ? "outline" : "transparent"
              }
            >
              <Image alt={p.name} src={p.file} maw={120} />
            </Button>
          ))}
        </Flex>
      </Stack>

      {children}

      {/* Features Section */}
      <div style={{ marginTop: 120 }}>
        <Stack align="center" gap={8} mb={48}>
          <Badge
            size="lg"
            variant="gradient"
            gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
          >
            How It Works
          </Badge>
          <Title
            order={2}
            ta="center"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "#f1f5f9",
            }}
          >
            Record {platform.name} Streams Automatically
          </Title>
          <Text
            ta="center"
            maw={500}
            style={{ color: "#94a3b8", lineHeight: 1.7 }}
          >
            Our service runs 24/7 so you never miss a moment
          </Text>
        </Stack>

        <Flex gap={24} wrap="wrap" justify="center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Paper
                key={index}
                p="xl"
                radius="lg"
                style={{
                  flex: "1 1 calc(50% - 12px)",

                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <Flex gap={16} align="flex-start">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "rgba(99, 102, 241, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6366f1",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <Title
                      order={4}
                      mb={8}
                      style={{ color: "#f1f5f9", fontWeight: 600 }}
                    >
                      {feature.title}
                    </Title>
                    <Text
                      size="sm"
                      style={{ color: "#94a3b8", lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Text>
                  </div>
                </Flex>
              </Paper>
            );
          })}
        </Flex>
      </div>

      {/* CTA Section */}
      <div style={{ marginTop: 120 }}>
        <Paper
          p={60}
          radius="xl"
          style={{
            background: `linear-gradient(135deg, ${platform.color}20 0%, rgba(168, 85, 247, 0.1) 100%)`,
            border: `1px solid ${platform.color}30`,
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
              background: `radial-gradient(ellipse at center, ${platform.color}10 0%, transparent 50%)`,
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
              Start Recording {platform.name} Today
            </Title>
            <Text
              size="lg"
              maw={500}
              style={{ color: "#94a3b8", lineHeight: 1.7 }}
            >
              Join thousands of users who never miss their favorite{" "}
              {platform.name} streams. Free to get started.
            </Text>
            <Flex
              gap={16}
              mt={8}
              direction="column"
              justify="center"
              align="center"
            >
              <Button
                component="a"
                href="/register"
                size="lg"
                variant="gradient"
                gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                leftSection={<IconUserPlus size={20} />}
                style={{ fontWeight: 600 }}
              >
                Create Free Account
              </Button>
            </Flex>
          </Stack>
        </Paper>
      </div>

      <div style={{ marginTop: "100px" }}>
        <Stack gap="xl">
          <div>
            <Title order={2}>About Live Stream Recorder</Title>
            <Text c="dimmed" size="lg" mt="sm">
              Never miss a moment from your favorite creators. Our live stream
              recorder automatically captures broadcasts so you can watch them
              on your own schedule.
            </Text>
          </div>

          <div>
            <Title order={4}>Follow Your Favorite Streamers</Title>
            <Text mt="xs">
              Simply follow the creators you love, and we handle the rest. Our
              service works around the clock, recording streaming video in the
              background and making it available on-demand. No stream recording
              software to install, no manual scheduling, just follow and we
              capture every broadcast automatically.
            </Text>
          </div>

          <div>
            <Title order={4}>Watch Anytime, Anywhere</Title>
            <Text mt="xs">
              Busy schedule? Different time zone? No problem. With our
              livestream recording service, you can catch up on live content
              whenever it suits you. Access your recordings through our built-in
              player or download them for offline viewing.
            </Text>
          </div>

          <div>
            <Title order={4}>Securely Stored in the Cloud</Title>
            <Text mt="xs">
              Your recorded streams are saved securely on our servers. No
              storage fees, no lost files, just reliable access to your favorite
              content whenever you need it. From Twitch VOD downloads to Tiktok
              live stream captures, everything is organized and ready to watch.
            </Text>
          </div>

          <div>
            <Title order={4}>One Platform, Every Stream</Title>
            <Text mt="xs">
              Whether you want to record Tiktok streams, capture Twitch live
              broadcasts, or save content from other platforms, our stream
              recording service has you covered. We are continuously expanding
              to support more platforms so you never miss out.
            </Text>
          </div>

          <div>
            <Title order={4}>Free to Get Started</Title>
            <Text mt="xs">
              Create an account and start recording your favorite streamers
              today. Upgrade to premium for higher quality recordings, more
              simultaneous follows, and faster downloads.
            </Text>
          </div>
        </Stack>
      </div>
    </Container>
  );
}
