"use client";

import { Loader, SimpleGrid, Stack, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useMemo } from "react";

import { useQueryStates } from "nuqs";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { CreatorCard } from "@/app/[locale]/(protected)/components/creator-card";
import { useUser } from "@/app/providers/user-provider";
import { fetchFollowers } from "../actions/fetch-followers";
import { exploreParsers } from "../lib/search-params";

export default function CreatorsInfinity() {
  const [filters] = useQueryStates(exploreParsers);
  const t = useTranslations("protected.discover");
  const user = useUser();

  const excludeFollowingIds = useMemo(
    () =>
      (user?.followers || [])
        .map((f) => f.id)
        .filter((id): id is number => typeof id === "number"),
    [user?.followers],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "creators",
        "discover",
        filters,
        filters.excludeMyCreators ? excludeFollowingIds : null,
      ],
      queryFn: ({ pageParam }) =>
        fetchFollowers(filters, pageParam, excludeFollowingIds),
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
    // Guard: only fetch next page when user is actually on the discover page.
    // When a video modal opens on top (intercepted route), Mantine Modal adds
    // overflow:hidden to body which causes a layout shift. That re-fires the
    // intersection observer, falsely triggering fetchNextPage and loading new
    // creators (and their preview images) while the user is watching a video.
    // Checking pathname prevents this.
    const isOnPage = window.location.pathname.endsWith("/discover");
    if (
      entry?.isIntersecting &&
      hasNextPage &&
      !isFetchingNextPage &&
      isOnPage
    ) {
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
      <SimpleGrid
        cols={{ base: 2, xs: 3, sm: 4, md: 5, lg: 6 }}
        spacing="md"
        verticalSpacing="md"
      >
        {allFollowers.map((follower) => (
          <CreatorCard
            key={follower.documentId}
            follower={follower}
            width="100%"
          />
        ))}
      </SimpleGrid>

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
