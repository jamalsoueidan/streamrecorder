import { getFollowerFilters } from "@/app/actions/followers";
import { getQueryClient, HydrateClient, trpc } from "@/app/trpc/server";
import { Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconWorldSearch } from "@tabler/icons-react";
import CreatorsInfinity from "./components/creators-infinity";
import Filters from "./components/filters";
import { CreatorFilters, creatorsParamsCache } from "./lib/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CreatorFilters>;
}) {
  const filters = await creatorsParamsCache.parse(searchParams);

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(
    trpc.followers.browse.infiniteQueryOptions({
      scope: "discover",
      filters: {
        country: filters.country ?? undefined,
        language: filters.language ?? undefined,
        gender: filters.gender ?? undefined,
        type: filters.type ?? undefined,
        search: filters.search ?? undefined,
      },
    })
  );

  const filterOptions = await getFollowerFilters();

  return (
    <HydrateClient>
      <Stack w="100%">
        <Group justify="space-between" w="100%">
          <Stack gap={2}>
            <Group gap="xs">
              <IconWorldSearch size={32} />
              <Title order={1} size="h3">
                Discover
              </Title>
            </Group>
            <Text size="xs" c="dimmed">
              Explore creators and expand your list
            </Text>
          </Stack>

          <Filters filterOptions={filterOptions} />
        </Group>
        <Divider mx={{ base: "-xs", sm: "-md" }} />
        <CreatorsInfinity />
      </Stack>
    </HydrateClient>
  );
}
