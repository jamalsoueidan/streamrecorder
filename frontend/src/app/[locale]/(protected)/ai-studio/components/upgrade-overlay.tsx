"use client";

import {
  Box,
  Button,
  Card,
  Center,
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
    <Box pos="relative" w="100%" h="100%" style={{ overflow: "hidden" }}>
      {/* Background skeleton cards */}
      <Box
        style={{ filter: "blur(2px)", opacity: 0.3, pointerEvents: "none" }}
      >
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </SimpleGrid>
      </Box>

      {/* Centered upgrade card */}
      <Center pos="absolute" top={0} left={0} right={0} bottom={0} pb={{ base: "10%", sm: "25%" }}>
        <Card withBorder radius="lg" p="xl" maw={500} w="90%">
          <Stack gap="lg" align="center">
            <ThemeIcon
              size={80}
              radius="xl"
              variant="gradient"
              gradient={{ from: "violet", to: "blue" }}
            >
              <IconSparkles size={40} />
            </ThemeIcon>

            <Stack gap={4} align="center">
              <Title order={2} ta="center">
                {t("title")}
              </Title>
              <Text c="dimmed" ta="center" size="lg">
                {t("subtitle")}
              </Text>
            </Stack>

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
      </Center>
    </Box>
  );
}
