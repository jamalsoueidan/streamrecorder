"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toggleFavorite } from "../actions/toggle-favorite";

interface FavoriteButtonProps {
  documentId: string;
  isFavorite: boolean;
}

export function FavoriteButton({ documentId, isFavorite: initialFavorite }: FavoriteButtonProps) {
  const [optimistic, setOptimistic] = useState(initialFavorite);
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslations("protected.myList");

  const handleClick = async () => {
    setPending(true);
    setOptimistic(!optimistic);

    try {
      await toggleFavorite(documentId, optimistic);
      queryClient.invalidateQueries({ queryKey: ["creators", "mylist"] });
    } catch {
      setOptimistic(optimistic); // revert on error
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
        {optimistic ? (
          <IconStarFilled size={20} />
        ) : (
          <IconStar size={20} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
