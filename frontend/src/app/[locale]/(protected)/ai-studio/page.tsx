import {
  ActionIcon,
  Badge,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";

import api from "@/lib/api";
import { AiRequestList } from "./components/ai-request-list";
import { AiStudioGuard } from "./components/ai-studio-guard";

const MONTHLY_QUOTA = 6;

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const t = await getTranslations("protected.aiStudio");
  const currentPage = parseInt(page || "1", 10);

  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();

  const [response, usageResponse] = await Promise.all([
    api.aiRequest
      .meGetAiRequests({
        populate: {
          follower: { populate: { avatar: true } },
          recording: true,
          ai_tasks: true,
        },
        "pagination[pageSize]": 12,
        "pagination[page]": currentPage,
        sort: "createdAt:desc",
      })
      .catch(() => null),
    api.aiRequest
      .meGetAiRequests({
        "pagination[pageSize]": 1,
        "pagination[page]": 1,
        filters: {
          createdAt: {
            $gte: startOfMonth,
          },
        },
      })
      .catch(() => null),
  ]);

  const aiRequests = response?.data?.data || [];
  const totalPages = response?.data?.meta?.pagination?.pageCount || 1;
  const usedThisMonth = Math.min(usageResponse?.data?.meta?.pagination?.total ?? 0, MONTHLY_QUOTA);
  const remaining = Math.max(0, MONTHLY_QUOTA - usedThisMonth);
  const usageColor =
    remaining === 0 ? "red" : remaining === 1 ? "orange" : "violet";
  const resetDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  ).toLocaleDateString("en", { month: "short", day: "numeric" });

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
        <Stack gap={4} align="flex-end">
          <Badge size="lg" color={usageColor} variant="light">
            {t("quota.badge", { used: usedThisMonth, total: MONTHLY_QUOTA })}
          </Badge>
          {remaining === 0 && (
            <Text size="xs" c="dimmed">
              {t("quota.limitReachedNote", { date: resetDate })}
            </Text>
          )}
        </Stack>
      </Flex>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      <AiStudioGuard>
        {aiRequests.length === 0 && currentPage === 1 ? (
          <EmptyState />
        ) : (
          <AiRequestList
            aiRequests={aiRequests}
            currentPage={currentPage}
            totalPages={totalPages}
          />
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
