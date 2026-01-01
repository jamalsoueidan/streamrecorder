import { Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getFollowerFilters } from "@/app/actions/followers";
import { fetchRecordings } from "./actions/fetch-recordings";
import Filters from "./components/filters";
import FollowingInfinity from "./components/following-infinity";
import { FollowingFilters, followingParamsCache } from "./lib/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<FollowingFilters>;
}) {
  const filters = await followingParamsCache.parse(searchParams);

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["recordings", filters],
    queryFn: ({ pageParam }) => fetchRecordings(filters, pageParam),
    initialPageParam: 1,
  });

  const filterOptions = await getFollowerFilters();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <Group justify="space-between" w="100%">
          <Stack gap={2}>
            <Group gap="xs">
              <IconUsers size={32} />
              <Title order={1} size="h3">
                Following
              </Title>
            </Group>
            <Text size="xs" c="dimmed">
              Recordings from creators you follow
            </Text>
          </Stack>

          <Filters filterOptions={filterOptions} />
        </Group>
        <Divider mx={{ base: "-xs", sm: "-md" }} />
        <FollowingInfinity />
      </Stack>
    </HydrationBoundary>
  );
}
