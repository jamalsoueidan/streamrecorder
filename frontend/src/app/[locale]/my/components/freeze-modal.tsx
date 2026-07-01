"use client";

import { Link } from "@/i18n/navigation";
import {
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMatches,
} from "@mantine/core";
import {
  IconBell,
  IconBroadcast,
  IconChartBar,
  IconClock,
  IconDownload,
  IconHeartHandshake,
  IconLanguage,
  IconMovie,
  IconScissors,
  IconShare,
  IconSparkles,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function FreezeModal({
  endsAt,
  discountCode,
}: {
  endsAt: number;
  discountCode: string;
}) {
  const t = useTranslations("protected.freeze");
  const tp = useTranslations("protected.premium");
  const pathname = usePathname();
  const isMobile = useMatches({ base: true, sm: false });
  const [remaining, setRemaining] = useState(() => endsAt - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(endsAt - Date.now()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  // Never block the subscribe/checkout page — users must be able to pay.
  if (pathname?.includes("/premium")) return null;

  const over = remaining <= 0;
  const hh = Math.max(0, Math.floor(remaining / 3600_000));
  const mm = Math.max(0, Math.floor((remaining % 3600_000) / 60_000));
  const ss = Math.max(0, Math.floor((remaining % 60_000) / 1000));
  const time = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  // Reuse the already-translated premium feature labels from the upgrade modals.
  const features = [
    { icon: IconUsers, label: tp("premiumRecord100"), color: "#a78bfa" },
    { icon: IconDownload, label: tp("premiumFullControl"), color: "#60a5fa" },
    { icon: IconBell, label: tp("premiumNotifications"), color: "#fbbf24" },
    {
      icon: IconBroadcast,
      label: tp("premiumLiveNotifications"),
      color: "#f43f5e",
    },
    { icon: IconMovie, label: tp("premiumAiHighlights"), color: "#34d399" },
    { icon: IconLanguage, label: tp("premiumAiSubtitles"), color: "#f472b6" },
    { icon: IconShare, label: tp("premiumPublishSocial"), color: "#38bdf8" },
    { icon: IconVideo, label: tp("premiumWatchLater"), color: "#c084fc" },
    { icon: IconSparkles, label: tp("premiumAiMemes"), color: "#fb923c" },
    { icon: IconScissors, label: tp("premiumClipEditor"), color: "#ef4444" },
    { icon: IconChartBar, label: tp("premiumTiktokInsights"), color: "#22d3ee" },
  ];

  return (
    <Modal
      opened
      onClose={() => {}}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      radius="lg"
      size="lg"
      padding={0}
      lockScroll
      overlayProps={{ blur: 6, backgroundOpacity: 0.8 }}
      styles={{ content: { border: "1px solid rgba(139, 92, 246, 0.45)" } }}
    >
      {/* Gradient header */}
      <Box
        p={isMobile ? "lg" : "xl"}
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          borderRadius: "var(--mantine-radius-lg) var(--mantine-radius-lg) 0 0",
        }}
      >
        <Stack align="center" gap="xs">
          <IconHeartHandshake size={46} color="white" stroke={1.5} />
          <Title order={2} c="white" ta="center" size={isMobile ? "h4" : "h3"}>
            {t("title")}
          </Title>
        </Stack>
      </Box>

      {/* Body */}
      <Stack gap="md" p="lg">
        {/* The honest one-liner — normal weight, it's the hook */}
        <Text ta="center">{t("body1")}</Text>

        {/* What you unlock */}
        <Stack gap="xs">
          <Text fw={600} size="sm" c="dimmed">
            {tp("unlockPremiumFeatures")}
          </Text>
          <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
            {features.map((f) => (
              <Group key={f.label} gap={6} wrap="nowrap">
                <f.icon size={15} color={f.color} style={{ flexShrink: 0 }} />
                <Text size="xs">{f.label}</Text>
              </Group>
            ))}
          </SimpleGrid>
        </Stack>

        {/* Discount */}
        <Paper
          p="sm"
          radius="md"
          style={{
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
          }}
        >
          <Flex justify="space-between" align="center" gap="sm" wrap="nowrap">
            <Badge color="violet" variant="filled" size="lg">
              20% OFF
            </Badge>
            <Paper
              px="md"
              py={8}
              radius="sm"
              style={{
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px dashed rgba(139, 92, 246, 0.6)",
                flexShrink: 0,
              }}
            >
              <Text
                fw={700}
                c="violet"
                style={{ fontFamily: "monospace", letterSpacing: "0.12em" }}
              >
                {discountCode}
              </Text>
            </Paper>
          </Flex>
        </Paper>

        {/* Subscribe CTA */}
        <Button
          component={Link}
          href="/my/premium"
          fullWidth
          size={isMobile ? "md" : "lg"}
          radius="md"
          leftSection={<IconSparkles size={18} color="#fbbf24" />}
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          }}
        >
          {t("subscribe")}
        </Button>

        {/* Countdown → unlock */}
        {over ? (
          <Button
            variant="light"
            color="gray"
            fullWidth
            radius="md"
            onClick={() => window.location.reload()}
          >
            {t("continueFree")}
          </Button>
        ) : (
          <Flex align="center" justify="center" gap={8}>
            <IconClock size={16} color="#94a3b8" />
            <Text size="sm" c="dimmed">
              {t("waitLabel", { time })}
            </Text>
          </Flex>
        )}

        {/* Reassurance footnote (cancel anytime / wait option) */}
        <Text ta="center" size="xs" c="dimmed">
          {t("body2")}
        </Text>
      </Stack>
    </Modal>
  );
}
