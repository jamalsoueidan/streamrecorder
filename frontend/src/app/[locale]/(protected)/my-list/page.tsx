import { getFollowerFilters } from "@/app/actions/followers";
import { Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { fetchFollowers } from "./actions/fetch-followers";
import CreatorsInfinity from "./components/creators-infinity";
import Filters from "./components/filters";
import { CreatorFilters, creatorsParamsCache } from "./lib/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CreatorFilters>;
}) {
  const t = await getTranslations("protected.myList");
  const filters = await creatorsParamsCache.parse(searchParams);

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["creators", "mylist", filters],
    queryFn: ({ pageParam }) => fetchFollowers(filters, pageParam),
    initialPageParam: 1,
  });

  const initialData = queryClient.getQueryData<
    InfiniteData<Awaited<ReturnType<typeof fetchFollowers>>>
  >(["creators", filters]);

  const filterOptions = await getFollowerFilters();

  const count = initialData?.pages?.[0]?.meta?.pagination?.total ?? 0;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <Group justify="space-between" w="100%">
          <Stack gap={2}>
            <Group gap="xs">
              <IconHeart size={32} />
              <Title order={1} size="h3">
                {t("title", { count })}
              </Title>
            </Group>
            <Text size="xs" c="dimmed">
              {t("description")}
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
