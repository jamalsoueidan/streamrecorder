import api from "@/lib/api";

import { deepMerge, Group, Stack, Text, Title } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import CreatorsInfinity from "./_components/creators-infinity";
import Filters from "./_components/filters";
import ScopeTabs from "./_components/scope-tabs";
import { discoverParamsCache } from "./lib/search-params";

const defaultOptions = {
  "pagination[pageSize]": 10,
  populate: {
    avatar: {
      fields: ["url"],
    },
    recordings: {
      populate: {
        sources: {
          fields: ["*"],
          filters: {
            state: { $ne: "failed" },
          },
          populate: ["videoSmall", "videoOriginal"],
        },
      },
    },
  },
};

interface PageProps {
  searchParams: Promise<{
    hasRecordings?: string;
    sort?: string;
    scope?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { sort, hasRecordings, scope } = await discoverParamsCache.parse(
    searchParams
  );

  const fetchAction = async (
    options: Parameters<typeof api.follower.browseFollowers>[0]
  ) => {
    "use server";
    const response = await api.follower.browseFollowers(
      deepMerge(defaultOptions, {
        scope,
        sort,
        hasRecordings,
        ...options,
      })
    );

    return {
      data: response.data?.data || [],
      meta: response.data?.meta,
    };
  };

  const { data, meta } = await fetchAction({ "pagination[page]": 1 });

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

  const isFollowing = scope === "following";

  return (
    <section>
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
              {isFollowing
                ? "Manage your followed creators"
                : "Explore and follow your favorite creators"}
            </Text>
          </Stack>

          <Filters filterOptions={filterOptions} />
        </Group>

        <ScopeTabs>
          {data.length === 0 ? (
            <Stack align="center" py="xl" gap="xs">
              <Text size="lg" fw={500}>
                {isFollowing
                  ? "You're not following anyone yet"
                  : "No creators to discover"}
              </Text>
              <Text size="sm" c="dimmed">
                {isFollowing
                  ? "Switch to Discover to find creators to follow"
                  : "Try adjusting your filters"}
              </Text>
            </Stack>
          ) : (
            <CreatorsInfinity
              initialData={data}
              initialPagination={meta}
              fetchAction={fetchAction}
            />
          )}
        </ScopeTabs>
      </Stack>
    </section>
  );
}
