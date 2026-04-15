"use client";

import { trackEvent } from "@/app/lib/analytics";
import { Link } from "@/i18n/navigation";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  useMatches,
} from "@mantine/core";
import { IconCrown, IconLock, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const DISCOUNT_CODE = "EXTRA20";

interface PlatformUpgradeModalProps {
  opened: boolean;
  onClose: () => void;
  platform?: string;
  platformIcon?: string;
}

export function PlatformUpgradeModal({
  opened,
  onClose,
  platform,
  platformIcon,
}: PlatformUpgradeModalProps) {
  const t = useTranslations("protected.search");
  const tp = useTranslations("protected.premium");
  const tc = useTranslations("protected.common");
  const isMobile = useMatches({ base: true, sm: false });

  const handleClose = () => {
    trackEvent("platform_upgrade_modal_close");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
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
      <Box
        p={isMobile ? "md" : "xl"}
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
          onClick={handleClose}
        >
          <IconX size={18} />
        </ActionIcon>

        <Stack align="center" gap="xs">
          <Group gap="xs">
            <IconLock size={36} color="white" />
            {platformIcon && (
              <Image
                src={platformIcon}
                alt={platform || ""}
                w={36}
                h={36}
                style={{ filter: "brightness(0) invert(1)" }}
              />
            )}
          </Group>
          <Title
            order={2}
            c="white"
            ta="center"
            size={isMobile ? "h4" : "h3"}
          >
            {t("upgrade.title", { platform: platform || "" })}
          </Title>
          <Text c="rgba(255,255,255,0.8)" ta="center" size="sm">
            {t("upgrade.description", { platform: platform || "" })}
          </Text>
        </Stack>
      </Box>

      <Stack gap="md" p="lg">
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
                {!isMobile && (
                  <Badge color="violet" variant="filled" size="sm">
                    20% OFF
                  </Badge>
                )}
                <Text size="sm" fw={600}>
                  {tc("followers.upgradeModalDiscount")}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                {tc("followers.upgradeModalCodeNote")}
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

        <Button
          component={Link}
          href="/premium"
          onClick={() => {
            trackEvent("platform_upgrade_modal_click", {
              platform: platform || "",
            });
            onClose();
          }}
          fullWidth
          size={isMobile ? "md" : "lg"}
          radius="md"
          leftSection={<IconCrown size={18} color="#fbbf24" />}
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          }}
        >
          {tc("followers.upgradeButton")}
        </Button>

        <Text ta="center" size="xs" c="dimmed">
          {tp("supportMessage")}
        </Text>
      </Stack>
    </Modal>
  );
}
