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
import { IconScissors } from "@tabler/icons-react";
import { getLocale, getTranslations } from "next-intl/server";

import PaginationControls from "@/app/components/pagination";
import api from "@/lib/api";
import { ClipCard } from "./components/clip-card";
import { MyClipsGuard } from "./components/my-clips-guard";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const t = await getTranslations("protected.myClips");
  const locale = await getLocale();

  const response = await api.clip
    .meGetClips({
      populate: {
        follower: {
          populate: { avatar: true },
        },
      },
      "pagination[pageSize]": 12,
      "pagination[page]": parseInt(page || "1", 10),
    })
    .catch(() => null);

  const clips = response?.data?.data;
  const meta = response?.data?.meta;
  const totalPages = meta?.pagination?.pageCount || 1;

  return (
    <Stack
      w="100%"
      h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)"
    >
      <Flex justify="space-between" align="center">
        <Stack gap={2}>
          <Flex gap="xs" align="center">
            <IconScissors size={32} />
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

      <MyClipsGuard>
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
                <ClipCard key={clip.documentId} clip={clip} locale={locale} />
              ))}
            </SimpleGrid>
            {totalPages > 1 && (
              <Center>
                <PaginationControls total={totalPages} size="lg" />
              </Center>
            )}
          </Stack>
        )}
      </MyClipsGuard>
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
