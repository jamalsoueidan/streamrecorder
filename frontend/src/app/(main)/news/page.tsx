import api from "@/lib/api";
import {
  Badge,
  Container,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconArticle, IconNews } from "@tabler/icons-react";
import { NewsList } from "./_components/news-list";

export default async function NewsPage() {
  const response = await api.article.getArticles({
    "pagination[limit]": 10,
    sort: "createdAt:desc",
  });

  const articles = response.data?.data || [];

  return (
    <Container size="md">
      <Stack align="center" gap="md" pb={60}>
        <Badge
          size="lg"
          variant="gradient"
          gradient={{ from: "teal", to: "green", deg: 90 }}
          leftSection={<IconNews size={14} />}
        >
          Announcements
        </Badge>
        <Title order={1} ta="center">
          News & Updates
        </Title>
        <Text size="xl" c="dimmed" ta="center" maw={600}>
          Stay informed about the latest announcements, features, and important
          updates.
        </Text>
      </Stack>

      {articles.length === 0 ? (
        <Paper p="xl" radius="lg">
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="xl" variant="light" color="gray">
              <IconArticle size={30} />
            </ThemeIcon>
            <Title order={3}>No news yet</Title>
            <Text c="dimmed">Check back soon for updates.</Text>
          </Stack>
        </Paper>
      ) : (
        <NewsList articles={articles} />
      )}
    </Container>
  );
}
