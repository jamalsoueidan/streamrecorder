"use client";

import { Loader, SimpleGrid, Stack, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useEffect } from "react";

import { useQueryStates } from "nuqs";

import { useInfiniteQuery } from "@tanstack/react-query";

import { useTranslations } from "next-intl";
import { EmptyState } from "../../components/empty-state";
import RecordingItem from "./recording-item";
import { fetchRecordings } from "../actions/fetch-recordings";
import { followingParsers } from "../lib/search-params";

export default function FollowingInfinity() {
  const [filters] = useQueryStates(followingParsers);
  const t = useTranslations("protected.following");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["following", filters],
      queryFn: ({ pageParam }) => fetchRecordings(filters, pageParam),
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

  const recordings = data?.pages.flatMap((p) => p.data) ?? [];

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

  if (recordings.length === 0) {
    const key = hasActiveFilters ? "emptyFiltered" : "emptyDefault";
    return (
      <EmptyState
        title={t(`${key}.title`)}
        description={t(`${key}.description`)}
      />
    );
  }

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing="lg">
        {recordings?.map((rec) => (
          <RecordingItem key={rec.id} recording={rec} />
        ))}
      </SimpleGrid>

      <div ref={ref} style={{ height: 1 }} />

      {isFetchingNextPage && (
        <Loader size="sm" style={{ alignSelf: "center" }} />
      )}
      {!hasNextPage && recordings.length > 0 && (
        <Text ta="center" c="dimmed">
          {t("noMoreToLoad")}
        </Text>
      )}
    </>
  );
}
