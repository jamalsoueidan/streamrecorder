"use client";

import { trackEvent } from "@/app/lib/analytics";
import { Link } from "@/i18n/navigation";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridCol,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBell,
  IconCrown,
  IconDownload,
  IconLanguage,
  IconMovie,
  IconScissors,
  IconSparkles,
  IconUsers,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const DISCOUNT_CODE = "FIRST25";

interface UpgradeModalProps {
  opened: boolean;
  onClose: () => void;
}

export function UpgradeModal({ opened, onClose }: UpgradeModalProps) {
  const t = useTranslations("protected.common");
  const tp = useTranslations("protected.premium");

  const features = [
    { icon: IconUsers, label: tp("premiumRecord100"), color: "#a78bfa" },
    { icon: IconDownload, label: tp("premiumFullControl"), color: "#60a5fa" },
    { icon: IconBell, label: tp("premiumNotifications"), color: "#fbbf24" },
    { icon: IconMovie, label: tp("premiumAiHighlights"), color: "#34d399" },
    { icon: IconLanguage, label: tp("premiumAiSubtitles"), color: "#f472b6" },
    { icon: IconScissors, label: tp("premiumPublishSocial"), color: "#38bdf8" },
    { icon: IconVideo, label: tp("premiumWatchLater"), color: "#c084fc" },
    { icon: IconSparkles, label: tp("premiumAiMemes"), color: "#fb923c" },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      padding={0}
      withCloseButton={false}
      radius="lg"
      size="md"
      centered
      styles={{
        content: {
          border: "1px solid rgba(139, 92, 246, 0.45)",
        },
      }}
    >
      {/* Gradient header */}
      <Box
        p="xl"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          borderRadius:
            "var(--mantine-radius-lg) var(--mantine-radius-lg) 0 0",
          position: "relative",
        }}
      >
        <ActionIcon
          pos="absolute"
          top={12}
          right={12}
          variant="subtle"
          color="white"
          onClick={() => {
            trackEvent("upgrade_modal_close");
            onClose();
          }}
        >
          <IconX size={18} />
        </ActionIcon>

        <Stack align="center" gap="xs">
          <IconCrown size={44} color="#fbbf24" />
          <Title order={2} c="white" ta="center" size="h3">
            {t("followers.upgradeModalHeadline")}
          </Title>
          <Text c="rgba(255,255,255,0.85)" ta="center" size="sm">
            {t("followers.max3Message")}
          </Text>
        </Stack>
      </Box>

      {/* Body */}
      <Stack gap="md" p="lg">
        {/* Features grid */}
        <Stack gap="xs">
          <Text fw={600} size="sm" c="dimmed">
            {tp("unlockPremiumFeatures")}
          </Text>
          <Grid gutter="xs">
            {features.map((f) => (
              <GridCol span={6} key={f.label}>
                <Group gap={6} wrap="nowrap">
                  <f.icon size={15} color={f.color} style={{ flexShrink: 0 }} />
                  <Text size="xs">{f.label}</Text>
                </Group>
              </GridCol>
            ))}
          </Grid>
        </Stack>

        {/* Discount section */}
        <Paper
          p="sm"
          radius="md"
          style={{
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
          }}
        >
          <Flex justify="space-between" align="center" gap="sm" wrap="nowrap">
            <Stack gap={2}>
              <Group gap="xs">
                <Badge color="violet" variant="filled" size="sm">
                  25% OFF
                </Badge>
                <Text size="sm" fw={600}>
                  {t("followers.upgradeModalDiscount")}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                {t("followers.upgradeModalCodeNote")}
              </Text>
            </Stack>
            <Paper
              px="sm"
              py={6}
              radius="sm"
              style={{
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px dashed rgba(139, 92, 246, 0.6)",
                flexShrink: 0,
              }}
            >
              <Text
                fw={700}
                size="sm"
                c="violet"
                style={{ fontFamily: "monospace", letterSpacing: "0.12em" }}
              >
                {DISCOUNT_CODE}
              </Text>
            </Paper>
          </Flex>
        </Paper>

        {/* CTA */}
        <Button
          component={Link}
          href="/premium"
          onClick={() => {
            trackEvent("upgrade_modal_click");
            onClose();
          }}
          fullWidth
          size="lg"
          radius="md"
          leftSection={<IconCrown size={18} color="#fbbf24" />}
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          }}
        >
          {t("followers.upgradeButton")}
        </Button>

        <Text ta="center" size="xs" c="dimmed">
          {tp("supportMessage")}
        </Text>
      </Stack>
    </Modal>
  );
}
