import { streamingPlatforms } from "@/app/lib/streaming-platforms";
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
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const featureIcons = [IconUsers, IconPlayerPlay, IconCloud, IconDeviceTv];
const featureKeys = ["follow", "watch", "cloud", "platform"] as const;

interface PageProps {
  params: Promise<{
    type: string;
  }>;
  children: React.ReactNode;
}

export default async function Page({ params, children }: PageProps) {
  const { type } = await params;
  const t = await getTranslations("creators");

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type,
  ) || {
    color: "#ff0050",
    name: "",
    file: "creators.png",
  };

  const platformKey = platform.name ? type : "all";

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
          {t(`hero.title.${platformKey}`)}
        </Title>

        <Text
          size="xl"
          ta="center"
          maw={600}
          style={{ color: "#94a3b8", lineHeight: 1.7 }}
        >
          {t(`hero.subtitle.${platformKey}`)}
        </Text>

        <Flex align="center" gap={30} mt={20} wrap="wrap">
          {streamingPlatforms.map((p) => (
            <Link
              key={p.name}
              href={`/creators/${p.name.toLowerCase()}`}
              style={{
                border: p.name.toLowerCase() === type ? "1px solid" : "none",
                borderRadius: "8px",
                padding: "4px",
              }}
            >
              <Image alt={p.name} src={p.file} w={120} />
            </Link>
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
            {t("features.badge")}
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
            {t(`features.title.${platformKey}`)}
          </Title>
          <Text
            ta="center"
            maw={500}
            style={{ color: "#94a3b8", lineHeight: 1.7 }}
          >
            {t("features.subtitle")}
          </Text>
        </Stack>

        <Flex gap={24} wrap="wrap" justify="center">
          {featureKeys.map((key, index) => {
            const Icon = featureIcons[index];
            return (
              <Paper
                key={key}
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
                      {t(`features.items.${key}.title`)}
                    </Title>
                    <Text
                      size="sm"
                      style={{ color: "#94a3b8", lineHeight: 1.7 }}
                    >
                      {t(`features.items.${key}.description`)}
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
              {t(`cta.title.${platformKey}`)}
            </Title>
            <Text
              size="lg"
              maw={500}
              style={{ color: "#94a3b8", lineHeight: 1.7 }}
            >
              {t(`cta.subtitle.${platformKey}`)}
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
                {t("cta.button")}
              </Button>
            </Flex>
          </Stack>
        </Paper>
      </div>

      <div style={{ marginTop: 100 }}>
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <Title order={2} mb="sm" style={{ color: "#f1f5f9" }}>
                {children}
              </Title>
            ),
            h3: ({ children }) => (
              <Title order={4} mt="xl" style={{ color: "#f1f5f9" }}>
                {children}
              </Title>
            ),
            p: ({ children }) => (
              <Text mt="xs" style={{ color: "#94a3b8" }}>
                {children}
              </Text>
            ),
          }}
        >
          {t(`about.${platformKey}`)}
        </ReactMarkdown>
      </div>
    </Container>
  );
}
