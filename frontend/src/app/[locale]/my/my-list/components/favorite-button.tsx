"use client";

import { useInvalidateRecordings } from "@/app/hooks/use-invalidate-recordings";
import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toggleFavorite } from "../actions/toggle-favorite";

interface FavoriteButtonProps {
  documentId: string;
  isFavorite: boolean;
  showLabel?: boolean;
}

export function FavoriteButton({
  documentId,
  isFavorite,
  showLabel,
}: FavoriteButtonProps) {
  const [optimistic, setOptimistic] = useState(isFavorite);
  const [pending, setPending] = useState(false);
  const invalidateRecordings = useInvalidateRecordings();
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
      invalidateRecordings();
      router.refresh();
    } catch {
      setOptimistic((prev) => !prev); // revert
    } finally {
      setPending(false);
    }
  };

  const label = optimistic ? t("unfavorite") : t("favorite");
  const icon = optimistic ? (
    <IconStarFilled size={18} />
  ) : (
    <IconStar size={18} />
  );

  if (showLabel) {
    return (
      <Button
        size="sm"
        radius="xl"
        color={optimistic ? "yellow" : "blue"}
        leftSection={icon}
        loading={pending}
        onClick={handleClick}
      >
        {label}
      </Button>
    );
  }

  return (
    <Tooltip label={label}>
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
