"use client";

import { useUser } from "@/app/providers/user-provider";
import {
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCrown,
  IconSettings,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAccount, updateUsername } from "./actions";

export default function SettingsPage() {
  const user = useUser();
  const t = useTranslations("protected.settings");
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm({
    initialValues: {
      username: user?.username || "",
    },
    validate: {
      username: (value) => {
        if (!value || value.length < 3) return t("profile.usernameMinLength");
        if (value.length > 30) return t("profile.usernameMaxLength");
        return null;
      },
    },
  });

  const handleUpdateUsername = async (values: { username: string }) => {
    if (values.username === user?.username) return;

    setIsUpdating(true);
    const result = await updateUsername(values.username);
    setIsUpdating(false);

    if (result.success) {
      notifications.show({
        title: t("profile.updateSuccess"),
        message: t("profile.usernameUpdated"),
        color: "green",
      });
      router.refresh();
    } else {
      notifications.show({
        title: t("profile.updateError"),
        message: result.error,
        color: "red",
      });
    }
  };

  const handleDeleteAccount = () => {
    modals.openConfirmModal({
      title: t("dangerZone.deleteConfirm.title"),
      children: <Text size="sm">{t("dangerZone.deleteConfirm.message")}</Text>,
      labels: {
        confirm: t("dangerZone.deleteConfirm.confirm"),
        cancel: t("dangerZone.deleteConfirm.cancel"),
      },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const result = await deleteAccount();
        if (result.success) {
          window.location.href = "/";
        } else {
          notifications.show({
            title: t("dangerZone.deleteError"),
            message: result.error,
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Stack w="100%">
      <Flex justify="space-between" align="center">
        <Stack gap={2}>
          <Flex gap="xs" align="center">
            <IconSettings size={32} />
            <Title order={1} size="h3">
              {t("title")}
            </Title>
          </Flex>
          <Text size="xs" c="dimmed">
            {t("description")}
          </Text>
        </Stack>
      </Flex>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {/* Profile Card */}
        <Card withBorder p="xl">
          <Stack gap="lg">
            <Group>
              <IconUser size={28} />
              <Title order={2}>
                {t("profile.title")}
              </Title>
            </Group>

            <form onSubmit={form.onSubmit(handleUpdateUsername)}>
              <Stack gap="lg">
                <TextInput
                  size="md"
                  label={t("profile.username")}
                  placeholder={t("profile.usernamePlaceholder")}
                  {...form.getInputProps("username")}
                />
                <Button
                  size="md"
                  type="submit"
                  loading={isUpdating}
                  disabled={form.values.username === user?.username}
                >
                  {t("profile.saveChanges")}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Card>

        {/* Subscription Card */}
        <Card withBorder p="xl">
          <Stack gap="lg">
            <Group>
              <IconCrown size={28} />
              <Title order={2}>
                {t("subscription.title")}
              </Title>
            </Group>

            <Group justify="space-between">
              <Text size="lg">{t("subscription.currentPlan")}</Text>
              <Badge size="xl" variant="light" color="blue">
                {user?.role?.name || "Free"}
              </Badge>
            </Group>

            <Text size="md" c="dimmed">
              {t("subscription.description")}
            </Text>
          </Stack>
        </Card>

        {/* Danger Zone Card - hidden for admins */}
        {user?.role?.type !== "admin" && (
          <Card
            withBorder
            p="xl"
            style={{ borderColor: "var(--mantine-color-red-6)" }}
          >
            <Stack gap="lg">
              <Group>
                <IconAlertTriangle size={28} color="var(--mantine-color-red-6)" />
                <Title order={2} c="red">
                  {t("dangerZone.title")}
                </Title>
              </Group>

              <Text size="md" c="dimmed">
                {t("dangerZone.description")}
              </Text>

              <Button
                size="md"
                color="red"
                variant="outline"
                leftSection={<IconTrash size={18} />}
                onClick={handleDeleteAccount}
              >
                {t("dangerZone.deleteAccount")}
              </Button>
            </Stack>
          </Card>
        )}
      </SimpleGrid>
    </Stack>
  );
}
