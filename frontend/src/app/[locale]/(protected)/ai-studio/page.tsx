import {
  ActionIcon,
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

export default async function Page() {
  const t = await getTranslations("protected.aiStudio");

  // Fetch all AI requests
  const response = await api.aiRequest
    .meGetAiRequests({
      populate: {
        follower: {
          populate: { avatar: true },
        },
        recording: true,
        ai_tasks: true,
      },
      "pagination[pageSize]": 100,
      sort: "createdAt:desc",
    })
    .catch(() => null);

  const aiRequests = response?.data?.data || [];

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
        {aiRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <AiRequestList aiRequests={aiRequests} />
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
