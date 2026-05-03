"use client";

import { useUser } from "@/app/providers/user-provider";
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconCrown } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function SubscriptionCard() {
  const user = useUser();
  const t = useTranslations("protected.settings");

  return (
    <Card withBorder p="xl">
      <Stack gap="lg">
        <Group>
          <IconCrown size={28} />
          <Title order={2}>{t("subscription.title")}</Title>
        </Group>

        <Group justify="space-between">
          <Text size="lg">{t("subscription.currentPlan")}</Text>
          <Badge size="xl" variant="light" color="blue">
            {user?.role?.name || "Free"}
          </Badge>
        </Group>

        <Text size="md" c="dimmed">
          {t("subscription.description")}
        </Text>
      </Stack>
    </Card>
  );
}
