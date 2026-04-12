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
import { IconBrandYoutube, IconLinkOff, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { disconnectYouTube, getYouTubeConnection } from "../actions/youtube";

export function YouTubeCard() {
  const t = useTranslations("protected.settings");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connection, setConnection] = useState<{
    documentId: string;
    connected: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    const youtubeStatus = searchParams.get("youtube");

    if (youtubeStatus === "error") {
      notifications.show({
        title: t("youtube.connectError"),
        message: t("youtube.connectErrorMessage"),
        color: "red",
      });
      router.replace("/settings");
      startTransition(() => setLoading(false));
      return;
    }

    if (youtubeStatus === "connected") {
      notifications.show({
        title: t("youtube.connectSuccess"),
        message: t("youtube.connectSuccessMessage"),
        color: "green",
      });
    }

    getYouTubeConnection().then((data) => {
      setConnection(data);
      setLoading(false);
      if (youtubeStatus === "connected") {
        router.replace("/settings");
      }
    });
  }, [searchParams, router, t]);

  const handleConnect = () => {
    window.location.href = "/api/auth/youtube?action=settings";
  };

  const handleDisconnect = async () => {
    if (!connection?.documentId) return;
    setDisconnecting(true);
    const result = await disconnectYouTube(connection.documentId);
    setDisconnecting(false);
    if (result.success) {
      setConnection(null);
      notifications.show({
        title: t("youtube.disconnectSuccess"),
        message: t("youtube.disconnectSuccessMessage"),
        color: "green",
      });
    } else {
      notifications.show({
        title: t("youtube.disconnectError"),
        message: result.error,
        color: "red",
      });
    }
  };

  return (
    <Card withBorder p="xl">
      <Stack gap="lg">
        <Group>
          <IconBrandYoutube size={28} color="red" />
          <Title order={2}>{t("youtube.title")}</Title>
        </Group>

        <Text size="md" c="dimmed">
          {connection
            ? t("youtube.descriptionConnected")
            : t("youtube.description")}
        </Text>

        {loading ? (
          <Loader size="sm" />
        ) : connection ? (
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Group gap="sm">
                <Avatar size="lg" radius="xl" color="red">
                  <IconBrandYoutube />
                </Avatar>
                <Stack gap={0}>
                  <Text size="lg" fw={500}>
                    {t("youtube.connected")}
                  </Text>
                </Stack>
              </Group>
              <Button
                size="md"
                radius="sm"
                variant="outline"
                color="red"
                leftSection={<IconLinkOff size={18} />}
                loading={disconnecting}
                onClick={handleDisconnect}
              >
                {t("youtube.disconnect")}
              </Button>
            </Group>
          </Paper>
        ) : (
          <Button
            size="lg"
            radius="sm"
            color="red"
            rightSection={<IconPlus />}
            onClick={handleConnect}
          >
            {t("youtube.connect")}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
