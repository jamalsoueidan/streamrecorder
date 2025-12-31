import api from "@/lib/api";
import { Group, Stack, Text, Title } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CreatorsInfinity from "./_components/creators-infinity";
import Filters from "./_components/filters";
import ScopeTabs from "./_components/scope-tabs";
import { fetchFollowers } from "./actions/fetch-followers";
import { discoverParamsCache } from "./lib/search-params";

interface PageProps {
  searchParams: Promise<{
    hasRecordings?: string;
    sort?: string;
    scope?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const filters = await discoverParamsCache.parse(searchParams);

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["followers", filters],
    queryFn: ({ pageParam }) => fetchFollowers(filters, pageParam),
    initialPageParam: 1,
  });

  const { data: filtersData } = await api.follower.getFollowerFilters();

  const filterOptions = {
    genders: (filtersData.genders ?? [])
      .filter((g) => g.value)
      .map((g) => ({ value: g.value || "", label: `${g.value} (${g.count})` })),
    countryCodes: (filtersData.countryCodes ?? [])
      .filter((c) => c.value !== "-")
      .map((c) => ({ value: c.value || "", label: `${c.value} (${c.count})` })),
    types: (filtersData.types ?? []).map((l) => ({
      value: l.value || "",
      label: `${l.value} (${l.count})`,
    })),
    languageCodes: (filtersData.languageCodes ?? []).map((l) => ({
      value: l.value || "",
      label: `${l.value} (${l.count})`,
    })),
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <Group justify="space-between" w="100%" mb="md">
          <Stack gap={2}>
            <Group gap="xs">
              <IconStar size={32} />
              <Title order={1} size="h3">
                Creators
              </Title>
            </Group>
            <Text size="xs" c="dimmed">
              Manage and discover creators
            </Text>
          </Stack>

          <Filters filterOptions={filterOptions} />
        </Group>
        <ScopeTabs>
          <CreatorsInfinity />
        </ScopeTabs>
      </Stack>
    </HydrationBoundary>
  );
}
