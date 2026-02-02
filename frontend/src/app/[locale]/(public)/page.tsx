import { generateProfileUrl } from "@/app/lib/profile-url";
import publicApi from "@/lib/public-api";
import {
  Button,
  Container,
  Flex,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ClipSlider } from "./components/clip-slider";
import { PlatformBadges } from "./components/platform-badge";
import { CreatorsSlider } from "./creators/components/creators-slider";
import { RecordingsSimpleGrid } from "./recordings/components/recordings-simple-grid";

export default async function LandingPage() {
  const t = await getTranslations("home");

  const {
    data: { data: followers },
  } = await publicApi.follower.getFollowers({
    filters: {
      description: { $notNull: true },
    },
    "pagination[limit]": 30,
    sort: "updatedAt:desc",
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

  const {
    data: { data: clips },
  } = await publicApi.clip.getRandomClips({
    limit: 12,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/#website`,
        name: "Live Stream Recorder",
        url: process.env.NEXT_PUBLIC_BASE_URL,
        description: t("hero.description"),
      },
      {
        "@type": "Organization",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/#organization`,
        name: "Live Stream Recorder",
        url: process.env.NEXT_PUBLIC_BASE_URL,
        logo: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`,
      },
      {
        "@type": "ItemList",
        name: t("featuredCreators.title"),
        numberOfItems: followers?.length || 0,
        itemListElement: followers?.map((follower, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: generateProfileUrl(follower, true),
        })),
      },
      {
        "@type": "ItemList",
        name: t("latestRecordings.title"),
        numberOfItems: recordings?.length || 0,
        itemListElement: recordings?.map((recording, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url:
            generateProfileUrl(recording.follower, true) +
            `/video/${recording.documentId}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container size="xl" my="sm">
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

        <PlatformBadges href={`/recordings/`} activePlatform={"type"} />

        <Stack
          align="center"
          style={{ position: "relative", zIndex: 1 }}
          mt="md"
        >
          <div>
            <Title
              order={1}
              ta="center"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 5.4rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("hero.title")}
            </Title>
            <Title
              order={2}
              ta="center"
              style={{
                fontSize: "clamp(2.2rem, 6vw, 4.4rem)",
                fontWeight: 700,
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
            c="#cbd5e1"
            maw={800}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.45rem)",
              lineHeight: 1.7,
              color: "#94a3b8",
            }}
          >
            {t("hero.description")}
          </Text>

          <Button
            component="a"
            href="/register"
            size="responsive"
            variant="gradient"
            gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
            radius="lg"
            style={{
              outline: "2px solid rgba(168, 85, 247, 0.5)",
              outlineOffset: "3px",
            }}
            mt="lg"
          >
            {t("cta.button")}
          </Button>
        </Stack>
      </Container>

      {clips ? <ClipSlider clips={clips} /> : null}

      <Container size="lg">
        <div style={{ marginTop: 100 }}>
          <Flex
            gap={60}
            align="center"
            direction={{ base: "column", md: "row" }}
          >
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
                    height: "auto",
                    minHeight: 200,
                  }}
                >
                  <Image
                    src="/desktop.png"
                    alt="Platform dashboard preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
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
              {t("latestRecordings.browseAll")}
            </Button>
          </Flex>

          <RecordingsSimpleGrid recordings={recordings} />
        </div>

        <div style={{ marginTop: 100, marginBottom: 50 }}>
          <Flex gap={8} align="center" direction="column">
            <Title
              order={2}
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "-0.03em",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                maxWidth: "800px",
              }}
            >
              {t("featuredCreators.title")}
            </Title>
            <Text size="xl" c="#cbd5e1">
              {t("featuredCreators.subtitle")}
            </Text>

            <Button
              component="a"
              variant="subtle"
              size="compact-lg"
              color="gray"
              href="/creators"
              rightSection={<IconArrowRight size={16} />}
              style={{ color: "#94a3b8" }}
            >
              {t("featuredCreators.browseAll")}
            </Button>
          </Flex>
        </div>
      </Container>

      <CreatorsSlider followers={followers} />

      <Container size="lg">
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
                style={{ color: "#94a3b8", lineHeight: 1.7 }}
                maw={700}
              >
                {t("cta.description")}
              </Text>

              <Button
                component="a"
                href="/register"
                size="responsive"
                variant="gradient"
                gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                radius="lg"
                style={{
                  outline: "2px solid rgba(168, 85, 247, 0.5)",
                  outlineOffset: "3px",
                }}
                mt="lg"
              >
                {t("cta.button")}
              </Button>
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
    </>
  );
}
