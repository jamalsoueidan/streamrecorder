"use client";

import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { deleteAccount } from "../actions/account";

export function DangerZoneCard() {
  const t = useTranslations("protected.settings");

  const handleDeleteAccount = () => {
    modals.openConfirmModal({
      title: t("dangerZone.deleteConfirm.title"),
      children: <Text size="sm">{t("dangerZone.deleteConfirm.message")}</Text>,
      labels: {
        confirm: t("dangerZone.deleteConfirm.confirm"),
        cancel: t("dangerZone.deleteConfirm.cancel"),
      },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const result = await deleteAccount();
        if (result.success) {
          window.location.href = "/";
        } else {
          notifications.show({
            title: t("dangerZone.deleteError"),
            message: result.error,
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Card
      withBorder
      p="xl"
      style={{ borderColor: "var(--mantine-color-red-6)" }}
    >
      <Stack gap="lg">
        <Group>
          <IconAlertTriangle size={28} color="var(--mantine-color-red-6)" />
          <Title order={2} c="red">
            {t("dangerZone.title")}
          </Title>
        </Group>

        <Text size="md" c="dimmed">
          {t("dangerZone.description")}
        </Text>

        <Button
          size="md"
          color="red"
          variant="outline"
          leftSection={<IconTrash size={18} />}
          onClick={handleDeleteAccount}
        >
          {t("dangerZone.deleteAccount")}
        </Button>
      </Stack>
    </Card>
  );
}
