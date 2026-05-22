"use client";

import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconShieldLock, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { clearMyTracking } from "../actions/tracking";

export function TrackingDataCard() {
  const t = useTranslations("protected.settings.trackingData");

  const handleClear = () => {
    modals.openConfirmModal({
      title: t("clearConfirm.title"),
      children: <Text size="sm">{t("clearConfirm.message")}</Text>,
      labels: {
        confirm: t("clearConfirm.confirm"),
        cancel: t("clearConfirm.cancel"),
      },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const result = await clearMyTracking();
        if (result.ok) {
          notifications.show({
            title: t("cleared.title"),
            message: t("cleared.message", {
              views: result.deletedViews ?? 0,
              downloads: result.deletedDownloads ?? 0,
            }),
            color: "green",
          });
        } else {
          notifications.show({
            title: t("error.title"),
            message: result.error ?? t("error.message"),
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Card withBorder p="xl">
      <Stack gap="lg">
        <Group>
          <IconShieldLock size={28} />
          <Title order={2}>{t("title")}</Title>
        </Group>

        <Text size="md" c="dimmed">
          {t("description")}
        </Text>

        <Button
          size="md"
          variant="outline"
          leftSection={<IconTrash size={18} />}
          onClick={handleClear}
        >
          {t("clearButton")}
        </Button>
      </Stack>
    </Card>
  );
}
