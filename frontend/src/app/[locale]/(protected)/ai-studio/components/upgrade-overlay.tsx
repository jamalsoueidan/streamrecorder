"use client";

import {
  Box,
  Button,
  Card,
  Group,
  List,
  Overlay,
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
    <Box pos="relative" w="100%" h="100%">
      <Box style={{ filter: "blur(2px)", opacity: 0.3 }}>
        <SimpleGrid cols={2} spacing="md">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </SimpleGrid>
      </Box>

      <Overlay color="#000" backgroundOpacity={0.1} blur={0.4} radius="xl">
        <Card
          withBorder
          radius="lg"
          p="xl"
          pos="absolute"
          maw={500}
          top="50%"
          left="50%"
          w="90%"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
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
              href="/settings"
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
      </Overlay>
    </Box>
  );
}
