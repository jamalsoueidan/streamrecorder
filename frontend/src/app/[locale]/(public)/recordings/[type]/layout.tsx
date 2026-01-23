import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import {
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
  children: React.ReactNode;
}

export default async function RecordingPage({ params, children }: PageProps) {
  const { type } = await params;
  const t = await getTranslations("recordings");

  const platform = streamingPlatforms.find(
    (p) => p.name.toLowerCase() === type,
  ) || {
    color: "#ff0050",
    name: "",
    file: "creators.png",
  };

  const platformName = platform.name || "All";
  const aboutKey = type === "all" ? "all" : type;

  return (
    <Container size="lg">
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
          {t(`hero.title.${platformName.toLowerCase()}`)}
        </Title>

        <Text
          size="xl"
          ta="center"
          maw={600}
          style={{ color: "#94a3b8", lineHeight: 1.7 }}
        >
          {}
          {t(`hero.subtitle.${platformName.toLowerCase()}`)}
        </Text>

        <SimpleGrid cols={{ base: 2, sm: 6 }} spacing="xl" mt={20}>
          {streamingPlatforms.map((p) => (
            <Link
              key={p.name}
              href={`/recordings/${p.name.toLowerCase()}`}
              style={{
                border: p.name.toLowerCase() === type ? "1px solid" : "none",
                borderRadius: "8px",
                padding: "4px",
              }}
            >
              <Image alt={p.name} src={p.file} width={120} height={120} />
            </Link>
          ))}
        </SimpleGrid>
      </Stack>
      {children}

      {/* CTA Section */}
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
              {t(`cta.title.${platformName.toLowerCase()}`)}
            </Title>
            <Text size="lg" style={{ color: "#94a3b8", lineHeight: 1.7 }}>
              {t("cta.subtitle")}
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

      <div style={{ marginTop: "100px" }}>
        <Markdown
          components={{
            h2: ({ children }) => (
              <Title order={2} mb="md">
                {children}
              </Title>
            ),
            h3: ({ children }) => (
              <Title order={4} mt="xl" mb="xs">
                {children}
              </Title>
            ),
            p: ({ children }) => (
              <Text c="dimmed" mb="md">
                {children}
              </Text>
            ),
          }}
        >
          {t.raw(`about.${aboutKey}`)}
        </Markdown>
      </div>
    </Container>
  );
}
