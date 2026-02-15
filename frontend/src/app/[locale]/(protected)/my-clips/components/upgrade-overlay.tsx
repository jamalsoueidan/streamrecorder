"use client";

import {
  Box,
  Button,
  Card,
  Center,
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
      </Center>
    </Box>
  );
}
