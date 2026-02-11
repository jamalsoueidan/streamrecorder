import {
  ActionIcon,
  Badge,
  Card,
  Center,
  Divider,
  Flex,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconScissors } from "@tabler/icons-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import PaginationControls from "@/app/components/pagination";
import api from "@/lib/api";
import { ClipPreview } from "./components/clip-preview";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const t = await getTranslations("protected.myClips");
  const format = await getFormatter();
  const locale = await getLocale();

  const {
    data: { data: clips, meta },
  } = await api.clip.getClipsMe({
    populate: {
      follower: {
        populate: { avatar: true },
      },
    },
    "pagination[pageSize]": 12,
    "pagination[page]": parseInt(page || "1", 10),
  });

  const totalPages = meta?.pagination?.pageCount || 1;

  return (
    <Stack w="100%">
      <Flex justify="space-between" align="center">
        <Stack gap={2}>
          <Flex gap="xs" align="center">
            <IconScissors size={32} />
            <Title order={1} size="h3">
              {t("title")}
            </Title>
          </Flex>
          <Text size="xs" c="dimmed">
            {t("description")}
          </Text>
        </Stack>
      </Flex>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      {!clips || clips.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack gap="xl">
          {totalPages > 1 && (
            <Center>
              <PaginationControls total={totalPages} size="lg" />
            </Center>
          )}
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {clips?.map((clip) => (
              <Card key={clip.documentId} radius="md" withBorder>
                <Stack gap="md">
                  <ClipPreview
                    clip={clip}
                    type={clip.follower?.type}
                    locale={locale}
                  />

                  <Stack gap="xs">
                    <Flex justify="space-between" align="center">
                      <Title order={3} lineClamp={1}>
                        {clip.title}
                      </Title>
                      <Badge size="lg" variant="light">
                        {clip.viral_score}/100
                      </Badge>
                    </Flex>

                    <Paper p="sm" withBorder>
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {clip.description}
                      </Text>
                    </Paper>

                    <Flex justify="space-between" align="center">
                      <Text size="xs" c="dimmed">
                        {clip.follower?.nickname || clip.follower?.username}
                      </Text>
                      <Text size="xs" c="dimmed" suppressHydrationWarning>
                        {format.dateTime(new Date(clip.createdAt || ""), {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </Flex>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
          {totalPages > 1 && (
            <Center>
              <PaginationControls total={totalPages} size="lg" />
            </Center>
          )}
        </Stack>
      )}
    </Stack>
  );
}

async function EmptyState() {
  const t = await getTranslations("protected.myClips");

  return (
    <Stack align="center" justify="center" py={80} gap="lg">
      <ActionIcon variant="transparent" size={120} radius="xl" color="white">
        <IconScissors size={90} stroke={2} />
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
