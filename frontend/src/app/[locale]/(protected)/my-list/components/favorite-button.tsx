"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toggleFavorite } from "../actions/toggle-favorite";

interface FavoriteButtonProps {
  documentId: string;
  isFavorite: boolean;
}

export function FavoriteButton({
  documentId,
  isFavorite,
}: FavoriteButtonProps) {
  const [optimistic, setOptimistic] = useState(isFavorite);
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("protected.myList");

  // Sync with prop when it changes (refetch, navigation)
  useEffect(() => {
    setOptimistic(isFavorite);
  }, [isFavorite]);

  const handleClick = async () => {
    setPending(true);
    setOptimistic((prev) => !prev);

    try {
      await toggleFavorite(documentId, isFavorite);
      queryClient.invalidateQueries({ queryKey: ["creators", "mylist"] });
      router.refresh();
    } catch {
      setOptimistic((prev) => !prev); // revert
    } finally {
      setPending(false);
    }
  };

  return (
    <Tooltip label={optimistic ? t("unfavorite") : t("favorite")}>
      <ActionIcon
        variant="subtle"
        color={optimistic ? "yellow" : "gray"}
        loading={pending}
        onClick={handleClick}
      >
        {optimistic ? <IconStarFilled size={20} /> : <IconStar size={20} />}
      </ActionIcon>
    </Tooltip>
  );
}
