"use client";

import { Grid, Loader, Stack, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useEffect } from "react";

import { useQueryStates } from "nuqs";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { fetchFollowers } from "../actions/fetch-followers";
import { exploreParsers } from "../lib/search-params";
import FollowerItem from "./follower-item";

export default function CreatorsInfinity() {
  const [filters] = useQueryStates(exploreParsers);
  const t = useTranslations("protected.discover");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["creators", "discover", filters],
      queryFn: ({ pageParam }) => fetchFollowers(filters, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page = 1, pageCount = 0 } = lastPage.meta?.pagination ?? {};
        return page < pageCount ? page + 1 : undefined;
      },
    });

  const { ref, entry } = useIntersection({
    threshold: 0.5,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allFollowers = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <Stack align="center" py="xl">
        <Loader size="lg" />
      </Stack>
    );
  }

  const hasActiveFilters = Boolean(
    filters.gender ||
    filters.country ||
    filters.language ||
    filters.type ||
    filters.search ||
    filters.dateRange,
  );

  if (allFollowers.length === 0) {
    return (
      <Stack align="center" py="xl" gap="xs">
        <Text size="lg" fw={500}>
          {hasActiveFilters
            ? t("emptyFiltered.title")
            : t("emptyDefault.title")}
        </Text>
        <Text size="sm" c="dimmed">
          {hasActiveFilters
            ? t("emptyFiltered.description")
            : t("emptyDefault.description")}
        </Text>
      </Stack>
    );
  }

  return (
    <>
      <Grid justify="flex-start" align="stretch">
        {allFollowers.map((follower) => (
          <FollowerItem key={follower.documentId} follower={follower} />
        ))}
      </Grid>

      <div ref={ref} style={{ height: 1 }} />

      {isFetchingNextPage && (
        <Loader size="sm" style={{ alignSelf: "center" }} />
      )}

      {!hasNextPage && allFollowers.length > 0 && (
        <Text ta="center" c="dimmed">
          {t("noMoreToLoad")}
        </Text>
      )}
    </>
  );
}
