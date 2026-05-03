"use client";

import { useWatchLater } from "@/app/hooks/use-watch-later";
import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface Props {
  initialCount: number;
}

export function ClearWatchLaterButton({ initialCount }: Props) {
  const t = useTranslations("protected.watchLater");
  const { watchLater, isInitialized, clearWatchLater } = useWatchLater();

  const count = isInitialized ? watchLater.length : initialCount;

  if (count === 0) {
    return null;
  }

  const handleClear = () => {
    modals.openConfirmModal({
      title: t("clearConfirm.title"),
      children: <Text size="sm">{t("clearConfirm.message")}</Text>,
      labels: {
        confirm: t("clearConfirm.confirm"),
        cancel: t("clearConfirm.cancel"),
      },
      confirmProps: { color: "red" },
      onConfirm: clearWatchLater,
    });
  };

  return (
    <Button
      variant="outline"
      size="md"
      leftSection={<IconTrash size={16} />}
      onClick={handleClear}
    >
      {t("clear")}
    </Button>
  );
}
