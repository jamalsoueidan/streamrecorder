import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import publicApi from "@/lib/public-api";
import {
  Anchor,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { CreatorsSimpleGrid } from "./creators/components/creators-simple-grid";
import { RecordingsSimpleGrid } from "./recordings/components/recordings-simple-grid";

export default async function LandingPage() {
  const t = await getTranslations("home");

  const {
    data: { data: followers },
  } = await publicApi.follower.getFollowers({
    filters: {
      description: { $notNull: true },
    },
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 700,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Image
          src="/background.svg"
          alt="background"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      <Stack align="center" style={{ position: "relative", zIndex: 1 }}>
        <div>
          <Title
            order={1}
            ta="center"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              maxWidth: "800px",
            }}
          >
            {t("hero.title")}
          </Title>
          <Title
            order={2}
            ta="center"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
              fontWeight: 600,
              lineHeight: 1.3,
              marginTop: "-0.3em",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("hero.subtitle")}
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
          {t("hero.description")}
        </Text>

        <SimpleGrid cols={{ base: 2, sm: 6 }} spacing="xl" mt={20}>
          {streamingPlatforms.map((p) => (
            <Anchor key={p.name} href={`/recordings/${p.name.toLowerCase()}`}>
              <Image
                alt={p.name}
                src={p.file}
                width={120}
                height={120}
                style={{ maxWidth: 120, height: "auto" }}
              />
            </Anchor>
          ))}
        </SimpleGrid>
      </Stack>

      <div style={{ marginTop: 80 }}>
        <Flex gap={60} align="center" direction={{ base: "column", md: "row" }}>
          <div style={{ flex: 1 }}>
            <Stack gap={24}>
              <div>
                <Title
                  order={2}
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.3rem)",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: "#f1f5f9",
                  }}
                >
                  {t("feature.title")}
                </Title>
                <Title
                  order={2}
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.3rem)",
                    fontWeight: 700,
                    lineHeight: 1.4,
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {t("feature.subtitle")}
                </Title>
              </div>

              <Text size="lg" style={{ color: "#94a3b8", lineHeight: 1.8 }}>
                {t("feature.description")}
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
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                }}
              >
                <Image
                  src="/desktop.png"
                  alt="Platform dashboard preview"
                  fill
                  style={{
                    borderRadius: "var(--mantine-radius-lg)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.7)",
                    objectFit: "cover",
                  }}
                />
              </div>
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
              {t("latestRecordings.title")}
            </Title>
            <Text size="md" c="dimmed">
              {t("latestRecordings.subtitle")}
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
            {t("latestRecordings.viewAll")}
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
              {t("featuredCreators.title")}
            </Title>
            <Text size="md" c="dimmed">
              {t("featuredCreators.subtitle")}
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
            {t("featuredCreators.browseAll")}
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
              {t("cta.title")}
            </Title>
            <Text
              size="lg"
              maw={500}
              style={{ color: "#94a3b8", lineHeight: 1.7 }}
            >
              {t("cta.description")}
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
                {t("cta.button")}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </div>

      <div style={{ marginTop: 100 }}>
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <Title order={2} mb="sm">
                {children}
              </Title>
            ),
            h3: ({ children }) => (
              <Title order={4} mt="xl">
                {children}
              </Title>
            ),
            p: ({ children }) => (
              <Text mt="xs" c="dimmed">
                {children}
              </Text>
            ),
          }}
        >
          {t("about")}
        </ReactMarkdown>
      </div>
    </Container>
  );
}
