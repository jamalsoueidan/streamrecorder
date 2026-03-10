import { Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconBrandSafari } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { fetchRecordings } from "./actions/fetch-recordings";
import Filters from "./components/filters";
import { FiltersWrapper } from "./components/filters-wrapper";
import FollowingInfinity from "./components/following-infinity";
import { FollowingFilters, followingParamsCache } from "./lib/search-params";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<FollowingFilters>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "protected.explore" });
  const filters = await followingParamsCache.parse(searchParams);

  const queryClient = new QueryClient();

  const initialData = await fetchRecordings(filters, 1);

  queryClient.setQueryData(
    ["explore", filters],
    { pages: [initialData], pageParams: [1] },
    { updatedAt: 0 },
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <Group justify="space-between" w="100%">
          <Stack gap={2}>
            <Group gap="xs">
              <IconBrandSafari size={32} />
              <Title order={1} size="h3">
                {t("title")}
              </Title>
            </Group>
            <Text size="sm" c="dimmed">
              {t("description")}
            </Text>
          </Stack>

          <Suspense fallback={<Filters />}>
            <FiltersWrapper />
          </Suspense>
        </Group>
        <Divider mx={{ base: "-xs", sm: "-md" }} />
        <FollowingInfinity />
      </Stack>
    </HydrationBoundary>
  );
}
