import { Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { getRecordingsByIds } from "./actions";
import { ClearWatchLaterButton } from "./components/clear-watch-later-button";
import WatchLaterList from "./components/watch-later-list";
import { getWatchLaterIds } from "./lib/get-watch-later-ids";

const PAGE_SIZE = 12;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "protected.watchLater" });
  const watchLaterIds = await getWatchLaterIds();
  const idsToFetch = watchLaterIds.slice(0, PAGE_SIZE);

  const queryClient = new QueryClient();

  if (idsToFetch.length > 0) {
    await queryClient.prefetchQuery({
      queryKey: ["watch-later", idsToFetch],
      queryFn: () => getRecordingsByIds(idsToFetch),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <Group justify="space-between" w="100%">
          <Stack gap={2}>
            <Group gap="xs">
              <IconClock size={32} />
              <Title order={1} size="h3">
                {t("title")}
              </Title>
            </Group>
            <Text size="xs" c="dimmed">
              {t("description")}
            </Text>
          </Stack>
          <ClearWatchLaterButton initialCount={watchLaterIds.length} />
        </Group>
        <Divider mx={{ base: "-xs", sm: "-md" }} />
        <WatchLaterList initialIds={watchLaterIds} />
      </Stack>
    </HydrationBoundary>
  );
}
