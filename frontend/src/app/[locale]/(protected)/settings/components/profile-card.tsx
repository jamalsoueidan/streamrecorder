"use client";

import { useUser } from "@/app/providers/user-provider";
import { Button, Card, Group, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateUsername } from "../actions/account";

export function ProfileCard() {
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

  return (
    <Card withBorder p="xl">
      <Stack gap="lg">
        <Group>
          <IconUser size={28} />
          <Title order={2}>{t("profile.title")}</Title>
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
  );
}
