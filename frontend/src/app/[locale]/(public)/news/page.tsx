import dayjs from "@/app/lib/dayjs";
import { generateAlternates } from "@/app/lib/seo";
import publicApi from "@/lib/public-api";
import { Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import { IconArticle } from "@tabler/icons-react";
import { getLocale, getTranslations } from "next-intl/server";
import ReactMarkdown from "react-markdown";

export async function generateMetadata() {
  const t = await getTranslations("news");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/news", locale),
  };
}

export default async function NewsPage() {
  const t = await getTranslations("news");
  const locale = await getLocale();

  const response = await publicApi.article.getArticles({
    "pagination[limit]": 10,
    sort: "createdAt:desc",
    locale: locale,
  });

  const articles = response.data?.data || [];

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

      {articles.length === 0 ? (
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
              <IconArticle size={30} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9" }}>
              {t("empty.title")}
            </Title>
            <Text style={{ color: "#64748b" }}>{t("empty.description")}</Text>
          </Stack>
        </Paper>
      ) : (
        <Stack gap="xl">
          {articles.map((article) => (
            <Paper
              key={article.documentId}
              p="lg"
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Flex gap={12} align="flex-start">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(99, 102, 241, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6366f1",
                    flexShrink: 0,
                  }}
                >
                  <IconArticle size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <Title order={4} mb="xs" style={{ color: "#f1f5f9" }}>
                    {article.title}
                  </Title>
                  {article.content && (
                    <div style={{ color: "#94a3b8", lineHeight: 1.7 }}>
                      <ReactMarkdown>{article.content}</ReactMarkdown>
                    </div>
                  )}
                  <Text size="xs" mt="sm" style={{ color: "#64748b" }}>
                    {dayjs(article.createdAt).fromNow()}
                  </Text>
                </div>
              </Flex>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}
