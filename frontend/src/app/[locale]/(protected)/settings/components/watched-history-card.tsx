"use client";

import { useWatched } from "@/app/hooks/use-watched";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function WatchedHistoryCard() {
  const t = useTranslations("protected.settings.watchedHistory");
  const { watched, clearWatched } = useWatched();
  const count = watched.length;

  const handleClear = () => {
    modals.openConfirmModal({
      title: t("clearConfirm.title"),
      children: <Text size="sm">{t("clearConfirm.message", { count })}</Text>,
      labels: {
        confirm: t("clearConfirm.confirm"),
        cancel: t("clearConfirm.cancel"),
      },
      confirmProps: { color: "red" },
      onConfirm: () => {
        clearWatched();
        notifications.show({
          title: t("cleared.title"),
          message: t("cleared.message"),
          color: "green",
        });
      },
    });
  };

  return (
    <Card withBorder p="xl">
      <Stack gap="lg">
        <Group>
          <IconEye size={28} />
          <Title order={2}>{t("title")}</Title>
        </Group>

        <Text size="md" c="dimmed">
          {t("description", { count })}
        </Text>

        <Button
          size="md"
          variant="outline"
          leftSection={<IconTrash size={18} />}
          onClick={handleClear}
          disabled={count === 0}
        >
          {t("clearButton")}
        </Button>
      </Stack>
    </Card>
  );
}
