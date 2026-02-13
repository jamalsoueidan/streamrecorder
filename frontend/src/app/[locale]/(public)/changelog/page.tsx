import dayjs from "@/app/lib/dayjs";
import { generateAlternates } from "@/app/lib/seo";
import publicApi from "@/lib/public-api";
import {
  Badge,
  Container,
  Flex,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendar, IconGitBranch } from "@tabler/icons-react";
import { getLocale, getTranslations } from "next-intl/server";
import ReactMarkdown from "react-markdown";

export async function generateMetadata() {
  const t = await getTranslations("changelog");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/changelog", locale),
  };
}

export default async function ChangelogPage() {
  const t = await getTranslations("changelog");
  const locale = await getLocale();

  const response = await publicApi.changeLog.getChangeLogs({
    sort: "createdAt:desc",
    locale: locale,
  });

  const changelogs = response.data?.data || [];

  return (
    <Container size="md" style={{ position: "relative", zIndex: 1 }}>
      <Stack align="center" gap="md" mb={60}>
        <Title
          order={1}
          ta="center"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: "-0.03em",
            background:
              "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            paddingBottom: "0.1em",
          }}
        >
          {t("title")}
        </Title>
        <Text
          size="xl"
          ta="center"
          maw={600}
          style={{ color: "#94a3b8", lineHeight: 1.7 }}
        >
          {t("subtitle")}
        </Text>
      </Stack>

      {changelogs.length === 0 ? (
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Stack align="center" gap="md">
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(100, 116, 139, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              <IconGitBranch size={30} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9" }}>
              {t("empty.title")}
            </Title>
            <Text style={{ color: "#64748b" }}>{t("empty.description")}</Text>
          </Stack>
        </Paper>
      ) : (
        <Stack gap={24}>
          {changelogs.map((entry) => (
            <Paper
              key={entry.id}
              p="lg"
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Flex
                justify="space-between"
                align="center"
                mb="sm"
                wrap="wrap"
                gap="sm"
              >
                <Badge
                  size="lg"
                  variant="light"
                  color="indigo"
                  radius="sm"
                  style={{ fontFamily: "monospace" }}
                >
                  v{entry.version}
                </Badge>
                <Flex gap={6} align="center" style={{ color: "#64748b" }}>
                  <IconCalendar size={14} />
                  <Text
                    size="sm"
                    title={dayjs(entry.createdAt).format("MMMM D, YYYY")}
                    style={{ color: "#64748b" }}
                  >
                    {dayjs(entry.createdAt).fromNow()}
                  </Text>
                </Flex>
              </Flex>

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  margin: "12px 0",
                }}
              />

              {entry.body ? (
                <div style={{ color: "#94a3b8", lineHeight: 1.7 }}>
                  <ReactMarkdown>{entry.body}</ReactMarkdown>
                </div>
              ) : (
                <Text size="sm" fs="italic" style={{ color: "#64748b" }}>
                  {t("noDescription")}
                </Text>
              )}

              <Text size="xs" mt="md" style={{ color: "#64748b" }}>
                {t("published", {
                  date: dayjs(entry.publishedAt).format("MMMM D, YYYY"),
                })}
              </Text>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}
