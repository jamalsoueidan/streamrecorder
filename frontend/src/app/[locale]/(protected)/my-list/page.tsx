import { getFollowerFilters } from "@/app/actions/followers";
import { Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import { fetchFollowers } from "./actions/fetch-followers";
import CreatorsInfinity from "./components/creators-infinity";
import Filters from "./components/filters";
import { CreatorFilters, creatorsParamsCache } from "./lib/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CreatorFilters>;
}) {
  const filters = await creatorsParamsCache.parse(searchParams);

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["creators", filters],
    queryFn: ({ pageParam }) => fetchFollowers(filters, pageParam),
    initialPageParam: 1,
  });

  const initialData = queryClient.getQueryData<
    InfiniteData<Awaited<ReturnType<typeof fetchFollowers>>>
  >(["creators", filters]);

  const filterOptions = await getFollowerFilters();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <Group justify="space-between" w="100%">
          <Stack gap={2}>
            <Group gap="xs">
              <IconHeart size={32} />
              <Title order={1} size="h3">
                My List ({initialData?.pages?.[0]?.meta?.pagination?.total ?? 0}
                )
              </Title>
            </Group>
            <Text size="xs" c="dimmed">
              Manage your followed creators
            </Text>
          </Stack>

          <Filters filterOptions={filterOptions} />
        </Group>
        <Divider mx={{ base: "-xs", sm: "-md" }} />
        <CreatorsInfinity />
      </Stack>
    </HydrationBoundary>
  );
}
