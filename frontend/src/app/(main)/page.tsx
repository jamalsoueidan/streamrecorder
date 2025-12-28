import dayjs from "@/app/lib/dayjs";
import api from "@/lib/api";
import { getToken } from "@/lib/token";
import { Alert, Box, Button, Group, Text, Title } from "@mantine/core";
import { IconTools } from "@tabler/icons-react";
import { marked } from "marked";

export default async function Home() {
  const token = await getToken();
  const isLoggedIn = !!token;

  const articles = await api.article.getArticles({
    "pagination[limit]": 1,
    sort: "createdAt:desc",
  });

  return (
    <Box
      display="flex"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Box maw="80%" w="100%">
        <Title mb="lg">Latest news</Title>
        {articles.data.data?.map((article) => (
          <Alert
            key={article.documentId}
            icon={<IconTools size="xl" />}
            title={article.title}
            color={article.color || "teal"}
            mb="md"
            pb="lg"
            pt="lg"
            style={{ textAlign: "left" }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: marked.parse(article.content) as string,
              }}
            />
            <Text size="xs" c="dimmed">
              {dayjs(article.createdAt).fromNow()}
            </Text>
          </Alert>
        ))}

        <Group justify="center">
          {isLoggedIn ? (
            <Button component="a" href="/following" size="xl">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button component="a" href="/login" size="xl">
                Login
              </Button>
              <Button component="a" href="/register" variant="subtle" size="xl">
                Register
              </Button>
            </>
          )}
        </Group>
      </Box>
    </Box>
  );
}
