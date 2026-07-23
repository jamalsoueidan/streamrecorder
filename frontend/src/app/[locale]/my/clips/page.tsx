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
import { enrichClipsWithUrls } from "@/app/lib/clip-url.server";
import publicApi from "@/lib/public-api";
import { ClipCard } from "./components/clip-card";
import { ClipsPlatform } from "./components/clips-platform";
import { ClipsSort } from "./components/clips-sort";
import { clipsParamsCache, SortOptions } from "./lib/search-params";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const { sort, type } = clipsParamsCache.parse(params);
  const t = await getTranslations("protected.clips");
  const locale = await getLocale();

  const pageNumber = parseInt(params.page || "1", 10);
  const limit = 12;

  const response = await publicApi.clip
    .getClips({
      // Platform filter via the clip's follower.type ("" = all platforms).
      ...(type
        ? { filters: { follower: { type: { $eq: type } } } as never }
        : {}),
      populate: {
        follower: {
          populate: {
            avatar: true,
            owner: { fields: ["id"] },
          },
        },
        ...(locale !== "en"
          ? {
              localizations: {
                fields: ["locale", "title", "description"],
                filters: { locale: { $eq: locale } },
              },
            }
          : {}),
      } as never,
      "pagination[pageSize]": limit,
      "pagination[page]": pageNumber,
      "pagination[withCount]": true,
      sort: sort as SortOptions,
    })
    .catch(() => null);

  let rawClips = response?.data?.data ?? null;

  if (rawClips && locale !== "en") {
    rawClips = rawClips.map((c: any) => {
      const loc = c.localizations?.[0];
      if (loc?.title) {
        return {
          ...c,
          title: loc.title,
          description: loc.description || c.description,
        };
      }
      return c;
    });
  }

  const clips = rawClips ? await enrichClipsWithUrls(rawClips) : null;
  const meta = response?.data?.meta;
  const totalPages = meta?.pagination?.pageCount || 1;

  return (
    <Stack w="100%">
      <Flex justify="space-between" align="center" gap="md">
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
        <Flex gap="sm" align="center" wrap="wrap">
          <ClipsPlatform />
          <ClipsSort />
        </Flex>
      </Flex>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      {!clips || clips.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack gap="md">
          {totalPages > 1 && (
            <Center>
              <PaginationControls
                siblings={1}
                boundaries={1}
                total={totalPages}
                size="md"
              />
            </Center>
          )}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {clips.map((clip) => (
              <ClipCard key={clip.documentId} clip={clip} locale={locale} />
            ))}
          </SimpleGrid>
          {totalPages > 1 && (
            <Center>
              <PaginationControls
                siblings={1}
                boundaries={1}
                total={totalPages}
                size="md"
              />
            </Center>
          )}
        </Stack>
      )}
    </Stack>
  );
}

async function EmptyState() {
  const t = await getTranslations("protected.clips");

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
