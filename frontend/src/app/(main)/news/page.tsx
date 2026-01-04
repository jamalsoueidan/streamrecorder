import publicApi from "@/lib/public-api";
import { Container, Paper, Stack, Text, Title } from "@mantine/core";
import { IconArticle } from "@tabler/icons-react";
import { NewsList } from "./components/news-list";

export default async function NewsPage() {
  const response = await publicApi.article.getArticles({
    "pagination[limit]": 10,
    sort: "createdAt:desc",
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
          News and Updates
        </Title>
        <Text
          size="xl"
          ta="center"
          maw={600}
          style={{ color: "#94a3b8", lineHeight: 1.7 }}
        >
          Stay informed about the latest announcements, features, and important
          updates.
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
              No news yet
            </Title>
            <Text style={{ color: "#64748b" }}>
              Check back soon for updates.
            </Text>
          </Stack>
        </Paper>
      ) : (
        <NewsList articles={articles} />
      )}
    </Container>
  );
}
