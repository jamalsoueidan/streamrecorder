import publicApi from "@/lib/public-api";
import {
  Anchor,
  Button,
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
import { IconArrowRight } from "@tabler/icons-react";
import { CreatorsSimpleGrid } from "./creators/components/creators-simple-grid";
import { RecordingsSimpleGrid } from "./recordings/components/recordings-simple-grid";

export const streamingPlatforms = [
  { color: "#ff0050", name: "TikTok", file: "/tiktok.svg" },
  { color: "#9146ff", name: "Twitch", file: "/twitch.svg" },
  { color: "#53fc18", name: "Kick", file: "/kick.svg" },
  { color: "#ff0000", name: "YouTube", file: "/youtube.svg" },
  { color: "#ff424d", name: "AfreecaTV", file: "/afreecatv.svg" },
  { color: "#1da1f2", name: "Pandalive", file: "/pandalive.png" },
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
    "pagination[limit]": 8,
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
            order={2}
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
          maw={700}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            lineHeight: 1.7,
            color: "#94a3b8",
          }}
        >
          {
            "Cloud-based stream recording for TikTok, Twitch, Kick, YouTube, AfreecaTV, and Pandalive. Add your favorite creators and live streams are automatically captured and saved for you to watch anytime."
          }
        </Text>

        <Flex gap={30} align="center" mt={20}>
          {streamingPlatforms.map((p) => (
            <Tooltip key={p.name} label={p.name} withArrow>
              <Anchor href={`/recordings/${p.name.toLowerCase()}`}>
                <Image alt={p.name} src={p.file} maw={120} />
              </Anchor>
            </Tooltip>
          ))}
        </Flex>
      </Stack>

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
                  All Your Livestream Recordings
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
                Add streamers from any platform. Live streams are recorded
                automatically and VODs are saved for you. Come back whenever you
                are ready to watch or download.
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
            component="a"
            variant="subtle"
            color="gray"
            rightSection={<IconArrowRight size={16} />}
            style={{ color: "#94a3b8" }}
            href="/recordings"
          >
            View All
          </Button>
        </Flex>

        <RecordingsSimpleGrid recordings={recordings} />
      </div>

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
            component="a"
            variant="subtle"
            color="gray"
            href="/creators"
            rightSection={<IconArrowRight size={16} />}
            style={{ color: "#94a3b8" }}
          >
            Browse All
          </Button>
        </Flex>

        <CreatorsSimpleGrid followers={followers} />
      </div>

      <div style={{ marginTop: 100 }}>
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
              Never Miss a Live Stream Again
            </Title>
            <Text
              size="lg"
              maw={500}
              style={{ color: "#94a3b8", lineHeight: 1.7 }}
            >
              Sign up for free and start recording your favorite creators today.
            </Text>
            <Group gap={16} mt={16}>
              <Button
                component="a"
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

      <div style={{ marginTop: "100px" }}>
        <Stack gap="xl">
          <div>
            <Title order={2}>About Live Stream Recorder</Title>
            <Text c="dimmed" size="lg" mt="sm">
              Never miss a moment from your favorite creators. Our cloud-based
              platform lets you capture live streams automatically so you can
              watch them on your own schedule.
            </Text>
          </div>

          <div>
            <Title order={4}>Automatic Livestream Recording</Title>
            <Text mt="xs">
              Simply follow the creators you love, and our cloud servers handle
              the rest. Stream recording happens automatically in the background
              — no software to install, no manual scheduling. Just follow a
              creator and their live streams are captured for your personal use.
            </Text>
          </div>

          <div>
            <Title order={4}>Watch Anytime, Anywhere</Title>
            <Text mt="xs">
              Busy schedule? Different time zone? No problem. With cloud-based
              recording of streaming video, you can catch up on live content
              whenever it suits you. Access your recordings through our built-in
              player or download them for offline viewing.
            </Text>
          </div>

          <div>
            <Title order={4}>Securely Stored in the Cloud</Title>
            <Text mt="xs">
              Your recorded streams are saved securely on our servers. No
              storage fees, no lost files — just reliable access to your
              favorite content whenever you need it. Capture video streams from
              multiple platforms, all organized and ready to watch.
            </Text>
          </div>

          <div>
            <Title order={4}>Record TikTok, Twitch, YouTube & More</Title>
            <Text mt="xs">
              Whether you want to record TikTok live streams, record Twitch
              streams, or use YouTube live stream capture — our cloud-based
              service has you covered. Record Kick streams, AfreecaTV, and
              Pandalive too. Support for more platforms is continuously being
              added.
            </Text>
          </div>

          <div>
            <Title order={4}>No Screen Recorder Needed</Title>
            <Text mt="xs">
              Unlike a live stream screen recorder that requires your computer
              to stay on, our cloud service runs 24/7. No need for livestream
              screen recorder software or leaving your PC running. Streams are
              recorded even while you sleep.
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
