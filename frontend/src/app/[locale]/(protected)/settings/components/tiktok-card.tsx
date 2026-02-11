"use client";

import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBrandTiktok, IconLink, IconLinkOff } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import {
  disconnectTikTok,
  getTikTokAuthUrl,
  getTikTokConnection,
} from "../actions/tiktok";

export function TikTokCard() {
  const t = useTranslations("protected.settings");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tiktokConnection, setTiktokConnection] = useState<{
    documentId: string;
    openId: string;
    connected: boolean;
  } | null>(null);
  const [tiktokLoading, setTiktokLoading] = useState(true);
  const [tiktokDisconnecting, setTiktokDisconnecting] = useState(false);

  // Fetch TikTok connection status and handle callback notifications
  useEffect(() => {
    const tiktokStatus = searchParams.get("tiktok");

    // Handle error callback - just show notification and redirect
    if (tiktokStatus === "error") {
      notifications.show({
        title: t("tiktok.connectError"),
        message: t("tiktok.connectErrorMessage"),
        color: "red",
      });
      router.replace("/settings");
      startTransition(() => setTiktokLoading(false));
      return;
    }

    // Show success notification if coming from callback
    if (tiktokStatus === "connected") {
      notifications.show({
        title: t("tiktok.connectSuccess"),
        message: t("tiktok.connectSuccessMessage"),
        color: "green",
      });
    }

    // Fetch connection status
    getTikTokConnection().then((data) => {
      setTiktokConnection(data);
      setTiktokLoading(false);
      // Clear URL params after successful callback
      if (tiktokStatus === "connected") {
        router.replace("/settings");
      }
    });
  }, [searchParams, router, t]);

  const handleConnectTikTok = async () => {
    const authUrl = await getTikTokAuthUrl();
    window.location.href = authUrl;
  };

  const handleDisconnectTikTok = async () => {
    if (!tiktokConnection?.documentId) return;
    setTiktokDisconnecting(true);
    const result = await disconnectTikTok(tiktokConnection.documentId);
    setTiktokDisconnecting(false);
    if (result.success) {
      setTiktokConnection(null);
      notifications.show({
        title: t("tiktok.disconnectSuccess"),
        message: t("tiktok.disconnectSuccessMessage"),
        color: "green",
      });
    } else {
      notifications.show({
        title: t("tiktok.disconnectError"),
        message: result.error,
        color: "red",
      });
    }
  };

  return (
    <Card withBorder p="xl">
      <Stack gap="lg">
        <Group>
          <IconBrandTiktok size={28} />
          <Title order={2}>{t("tiktok.title")}</Title>
        </Group>

        <Text size="md" c="dimmed">
          {t("tiktok.description")}
        </Text>

        {tiktokLoading ? (
          <Loader size="sm" />
        ) : tiktokConnection ? (
          <Group justify="space-between">
            <Badge
              size="lg"
              variant="light"
              color="green"
              leftSection={<IconBrandTiktok size={14} />}
            >
              {t("tiktok.connected")}
            </Badge>
            <Button
              size="md"
              variant="outline"
              color="red"
              leftSection={<IconLinkOff size={18} />}
              loading={tiktokDisconnecting}
              onClick={handleDisconnectTikTok}
            >
              {t("tiktok.disconnect")}
            </Button>
          </Group>
        ) : (
          <Button
            size="md"
            leftSection={<IconLink size={18} />}
            onClick={handleConnectTikTok}
          >
            {t("tiktok.connect")}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
