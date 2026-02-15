"use client";

import {
  Button,
  Card,
  List,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCheck, IconCrown, IconScissors } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

function SkeletonCard() {
  return (
    <Card withBorder padding="md" radius="md">
      <Skeleton height={160} radius="md" mb="sm" animate={false} />
      <Stack gap="xs">
        <Skeleton height={14} width="60%" animate={false} />
        <Skeleton height={10} width="40%" animate={false} />
      </Stack>
    </Card>
  );
}

export function UpgradeOverlay() {
  const t = useTranslations("protected.myClips.upgrade");

  return (
    <div style={{ position: "relative" }}>
      {/* Background skeleton cards */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          inset: 0,
          overflow: "hidden",
          filter: "blur(2px)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        <SimpleGrid cols={2} spacing="md">
          <SkeletonCard />
          <SkeletonCard />
        </SimpleGrid>
      </div>

      {/* Upgrade card */}
      <Card
        withBorder
        radius="lg"
        p="xl"
        maw={500}
        mx="auto"
        style={{ position: "relative", zIndex: 1 }}
      >
        <Stack gap="lg" align="center">
          <ThemeIcon
            size={80}
            radius="xl"
            variant="gradient"
            gradient={{ from: "pink", to: "violet" }}
          >
            <IconScissors size={40} />
          </ThemeIcon>

          <Title order={3} ta="center">
            {t("title")}
          </Title>

          <List
            spacing="sm"
            center
            icon={
              <ThemeIcon color="green" size={24} radius="xl">
                <IconCheck size={16} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <Text>{t("features.publish")}</Text>
            </List.Item>
            <List.Item>
              <Text>{t("features.schedule")}</Text>
            </List.Item>
            <List.Item>
              <Text>{t("features.edit")}</Text>
            </List.Item>
          </List>

          <Button
            component={Link}
            href="/settings?upgrade=clips"
            size="lg"
            leftSection={<IconCrown size={20} />}
            variant="gradient"
            gradient={{ from: "pink", to: "violet" }}
            fullWidth
          >
            {t("upgradeButton")}
          </Button>

          <Text size="xs" c="dimmed" ta="center">
            {t("hint")}
          </Text>
        </Stack>
      </Card>
    </div>
  );
}
