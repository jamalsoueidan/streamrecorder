"use client";

import { Accordion, Alert, Loader, Stack, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";

import { useQueryStates } from "nuqs";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useUser } from "@/app/providers/user-provider";
import { EmptyState } from "../../components/empty-state";
import { fetchFollowers } from "../actions/fetch-followers";
import { exploreParsers } from "../lib/search-params";
import FollowerItem from "./follower-item";

export default function CreatorsInfinity() {
  const t = useTranslations("protected.myList");
  const user = useUser();
  const [filters] = useQueryStates(exploreParsers);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const followingIds = useMemo(
    () =>
      (user?.followers || [])
        .map((f) => f.id)
        .filter((id): id is number => typeof id === "number"),
    [user?.followers],
  );
  const favoriteIds = useMemo(
    () =>
      (user?.favorites || [])
        .map((f) => f.id)
        .filter((id): id is number => typeof id === "number"),
    [user?.favorites],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["creators", "mylist", filters, followingIds, favoriteIds],
      queryFn: ({ pageParam }) =>
        fetchFollowers(filters, pageParam, followingIds, favoriteIds),
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
    // Guard: only fetch next page when user is actually on the my-list page.
    // When a video modal opens on top (intercepted route), Mantine Modal adds
    // overflow:hidden to body which causes a layout shift. That re-fires the
    // intersection observer, falsely triggering fetchNextPage and loading new
    // creators (and their preview images) while the user is watching a video.
    // Checking pathname prevents this.
    const isOnPage = window.location.pathname.endsWith("/my-list");
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
      <Alert c="dimmed" mb="xs">
        {t("disabledHint")}
      </Alert>
      <Accordion
        multiple
        variant="separated"
        w="100%"
        chevronPosition="left"
        chevronIconSize={28}
        value={openItems}
        onChange={setOpenItems}
      >
        {allFollowers.map((follower) => (
          <FollowerItem
            key={follower.documentId}
            follower={follower}
            isOpen={openItems.includes(follower.username)}
          />
        ))}
      </Accordion>

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
