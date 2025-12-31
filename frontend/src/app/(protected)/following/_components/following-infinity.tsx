"use client";

import { Loader, SimpleGrid, Stack, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useEffect } from "react";

import { useQueryStates } from "nuqs";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchRecordings } from "../actions/fetch-recordings";
import { discoverParsers } from "../lib/search-params";
import RecordingItem from "./recording-item";

export default function FollowingInfinity() {
  const [filters] = useQueryStates(discoverParsers);

  console.log("COMPONENT RENDER");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    status,
    fetchStatus,
  } = useInfiniteQuery({
    queryKey: ["recordings", filters],
    queryFn: ({ pageParam }) => {
      console.log("QUERY FN CALLED - page:", pageParam);
      return fetchRecordings(filters, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page = 1, pageCount = 0 } = lastPage.meta?.pagination ?? {};
      return page < pageCount ? page + 1 : undefined;
    },
  });

  console.log("QUERY STATE:", {
    status,
    fetchStatus,
    isLoading,
    isFetching,
    hasData: !!data,
  });

  const { ref, entry } = useIntersection({
    threshold: 0.5,
  });

  useEffect(() => {
    console.log("INTERSECTION:", {
      isIntersecting: entry?.isIntersecting,
      hasNextPage,
      isFetchingNextPage,
    });
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      console.log("CALLING fetchNextPage()");
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
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing="lg">
        {allFollowers?.map((rec) => (
          <RecordingItem key={rec.id} recording={rec} />
        ))}
      </SimpleGrid>

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
