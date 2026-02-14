"use client";

import {
  Box,
  Button,
  Card,
  List,
  Overlay,
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
      <Skeleton height={160} radius="md" mb="sm" />
      <Stack gap="xs">
        <Skeleton height={14} width="60%" />
        <Skeleton height={10} width="40%" />
      </Stack>
    </Card>
  );
}

export function UpgradeOverlay() {
  const t = useTranslations("protected.myClips.upgrade");

  return (
    <Box pos="relative" w="100%" h="100%">
      <Box style={{ filter: "blur(2px)", opacity: 0.6 }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
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
          top="30%"
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
              gradient={{ from: "pink", to: "violet" }}
            >
              <IconScissors size={40} />
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
              href="/settings"
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
      </Overlay>
    </Box>
  );
}
