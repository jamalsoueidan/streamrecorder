import {
  ActionIcon,
  Center,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";

import PaginationControls from "@/app/components/pagination";
import api from "@/lib/api";
import { AiRequestCard } from "./components/ai-request-card";
import { AiStudioGuard } from "./components/ai-studio-guard";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const t = await getTranslations("protected.aiStudio");

  // Try to fetch AI requests - will fail with 403 if user doesn't have permission
  const response = await api.aiRequest
    .meGetAiRequests({
      populate: {
        follower: {
          populate: { avatar: true },
        },
        recording: true,
      },
      "pagination[pageSize]": 12,
      "pagination[page]": parseInt(page || "1", 10),
      sort: "createdAt:desc",
    })
    .catch(() => null);

  const aiRequests = response?.data?.data;
  const meta = response?.data?.meta;
  const totalPages = meta?.pagination?.pageCount || 1;

  return (
    <Stack w="100%">
      <Flex justify="space-between" align="center">
        <Stack gap={2}>
          <Flex gap="xs" align="center">
            <IconSparkles size={32} />
            <Title order={1} size="h3">
              {t("title")}
            </Title>
          </Flex>
          <Text size="sm" c="dimmed">
            {t("description")}
          </Text>
        </Stack>
      </Flex>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      <AiStudioGuard>
        {!aiRequests || aiRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <Stack gap="xl">
            {totalPages > 1 && (
              <Center>
                <PaginationControls total={totalPages} size="lg" />
              </Center>
            )}
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              {aiRequests?.map((request) => (
                <AiRequestCard key={request.documentId} aiRequest={request} />
              ))}
            </SimpleGrid>
            {totalPages > 1 && (
              <Center>
                <PaginationControls total={totalPages} size="lg" />
              </Center>
            )}
          </Stack>
        )}
      </AiStudioGuard>
    </Stack>
  );
}

async function EmptyState() {
  const t = await getTranslations("protected.aiStudio");

  return (
    <Stack align="center" justify="center" py={80} gap="lg">
      <ActionIcon variant="transparent" size={120} radius="xl" color="violet">
        <IconSparkles size={90} stroke={2} />
      </ActionIcon>
      <Stack align="center" gap={12}>
        <Title order={2} fw={600}>
          {t("emptyState.title")}
        </Title>
        <Text size="xl" c="dimmed" maw={450} ta="center">
          {t("emptyState.description")}
        </Text>
      </Stack>
    </Stack>
  );
}
