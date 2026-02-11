"use client";

import {
  Avatar,
  Button,
  Card,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBrandTiktok, IconLinkOff, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { getCreatorInfo } from "../../my-clips/actions/share-tiktok";
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
    connected: boolean;
  } | null>(null);
  const [creatorInfo, setCreatorInfo] = useState<{
    username: string;
    nickname: string;
    avatarUrl: string;
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
    getTikTokConnection().then(async (data) => {
      setTiktokConnection(data);

      // If connected, fetch creator info from TikTok API
      if (data?.connected) {
        const info = await getCreatorInfo();
        if (info.success && info.data) {
          setCreatorInfo({
            username: info.data.creator_username,
            nickname: info.data.creator_nickname,
            avatarUrl: info.data.creator_avatar_url,
          });
        }
      }

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
      setCreatorInfo(null);
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
          {tiktokConnection
            ? t("tiktok.descriptionConnected")
            : t("tiktok.description")}
        </Text>

        {tiktokLoading ? (
          <Loader size="sm" />
        ) : tiktokConnection ? (
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Group gap="sm">
                <Avatar src={creatorInfo?.avatarUrl} size="lg" radius="xl">
                  <IconBrandTiktok />
                </Avatar>
                <Stack gap={0}>
                  <Text size="lg" fw={500}>
                    {creatorInfo?.nickname ||
                      creatorInfo?.username ||
                      t("tiktok.connected")}
                  </Text>
                  {creatorInfo?.username && (
                    <Text size="md" c="dimmed">
                      @{creatorInfo.username}
                    </Text>
                  )}
                </Stack>
              </Group>
              <Button
                size="md"
                radius="sm"
                variant="outline"
                color="red"
                leftSection={<IconLinkOff size={18} />}
                loading={tiktokDisconnecting}
                onClick={handleDisconnectTikTok}
              >
                {t("tiktok.disconnect")}
              </Button>
            </Group>
          </Paper>
        ) : (
          <Button
            size="lg"
            radius="sm"
            rightSection={<IconPlus />}
            onClick={handleConnectTikTok}
          >
            {t("tiktok.connect")}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
