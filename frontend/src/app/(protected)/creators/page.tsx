import { getFollowerFilters } from "@/app/actions/followers";
import { Group, Stack, Text, Title } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchFollowers } from "./actions/fetch-followers";
import CreatorsInfinity from "./components/creators-infinity";
import Filters from "./components/filters";
import ScopeTabs from "./components/scope-tabs";
import { CreatorFilters, creatorsParamsCache } from "./lib/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CreatorFilters>;
}) {
  const filters = await creatorsParamsCache.parse(searchParams);

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["followers", filters],
    queryFn: ({ pageParam }) => fetchFollowers(filters, pageParam),
    initialPageParam: 1,
  });

  const filterOptions = await getFollowerFilters();

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
