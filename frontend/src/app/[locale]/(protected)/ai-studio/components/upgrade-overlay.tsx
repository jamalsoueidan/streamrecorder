"use client";

import {
  Button,
  Card,
  Group,
  List,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCheck, IconCrown, IconSparkles } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

function SkeletonCard() {
  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap">
          <Skeleton height={48} circle animate={false} />
          <Stack gap={4}>
            <Skeleton height={14} width={120} animate={false} />
            <Skeleton height={10} width={80} animate={false} />
          </Stack>
        </Group>
        <Skeleton height={22} width={70} radius="xl" animate={false} />
      </Group>
      <Group gap="xs" mt="sm">
        <Skeleton height={18} width={50} radius="xl" animate={false} />
        <Skeleton height={18} width={60} radius="xl" animate={false} />
      </Group>
    </Card>
  );
}

export function UpgradeOverlay() {
  const t = useTranslations("protected.aiStudio.upgrade");

  return (
    <div style={{ position: "relative" }}>
      {/* Background skeleton cards */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          overflow: "hidden",
          filter: "blur(2px)",
          opacity: 0.3,
        }}
      >
        <SimpleGrid cols={2} spacing="md" w="100%">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </SimpleGrid>
      </div>

      {/* Upgrade card */}
      <Card withBorder radius="lg" p="xl" maw={500} mx="auto">
        <Stack gap="lg" align="center">
          <ThemeIcon
            size={80}
            radius="xl"
            variant="gradient"
            gradient={{ from: "violet", to: "blue" }}
          >
            <IconSparkles size={40} />
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
              <Text>{t("features.clips")}</Text>
            </List.Item>
            <List.Item>
              <Text>{t("features.memes")}</Text>
            </List.Item>
            <List.Item>
              <Text>{t("features.viral")}</Text>
            </List.Item>
          </List>

          <Button
            component={Link}
            href="/settings?upgrade=ai"
            size="lg"
            leftSection={<IconCrown size={20} />}
            variant="gradient"
            gradient={{ from: "violet", to: "blue" }}
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
