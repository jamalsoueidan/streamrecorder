"use client";

import { useUser } from "@/app/providers/user-provider";
import { Divider, Flex, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { DangerZoneCard } from "./components/danger-zone-card";
import { ProfileCard } from "./components/profile-card";
import { SubscriptionCard } from "./components/subscription-card";
import { TikTokCard } from "./components/tiktok-card";

export default function SettingsPage() {
  const user = useUser();
  const t = useTranslations("protected.settings");

  return (
    <Stack w="100%">
      <Flex justify="space-between" align="center">
        <Stack gap={2}>
          <Flex gap="xs" align="center">
            <IconSettings size={32} />
            <Title order={1} size="h3">
              {t("title")}
            </Title>
          </Flex>
          <Text size="sm" c="dimmed">
            {t("description")}
          </Text>
        </Stack>
      </Flex>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      <SimpleGrid cols={{ sm: 1, md: 2 }}>
        <ProfileCard />
        <SubscriptionCard />
        {user?.role?.type === "admin" && <TikTokCard />}
        {user?.role?.type !== "admin" && <DangerZoneCard />}
      </SimpleGrid>
    </Stack>
  );
}
