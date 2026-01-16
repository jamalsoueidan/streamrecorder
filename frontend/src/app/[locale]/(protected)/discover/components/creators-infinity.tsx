"use client";

import { Grid, Loader, Stack, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useEffect } from "react";

import { useQueryStates } from "nuqs";

import { useTRPC } from "@/app/trpc/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";
import { exploreParsers } from "../lib/search-params";
import FollowerItem from "./follower-item";

export default function CreatorsInfinity() {
  const [filters] = useQueryStates(exploreParsers);

  const trpc = useTRPC();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      trpc.followers.browse.infiniteQueryOptions(
        {
          scope: "discover",
          filters: {
            country: filters.country ?? undefined,
            language: filters.language ?? undefined,
            gender: filters.gender ?? undefined,
            type: filters.type ?? undefined,
            search: filters.search ?? undefined,
          },
        },
        {
          getNextPageParam: (lastPage) => {
            const { page = 1, pageCount = 0 } = lastPage.meta?.pagination ?? {};
            return page < pageCount ? page + 1 : undefined;
          },
        }
      )
    );

  const { ref, entry } = useIntersection({
    threshold: 0.5,
  });

  console.log(data);
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
      filters.dateRange
  );

  if (allFollowers.length === 0) {
    return (
      <Stack align="center" py="xl" gap="xs">
        <Text size="lg" fw={500}>
          {hasActiveFilters
            ? "No creators match your filters"
            : "No creators to discover"}
        </Text>
        <Text size="sm" c="dimmed">
          Try adjusting your filters
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
          No more to load
        </Text>
      )}
    </>
  );
}
