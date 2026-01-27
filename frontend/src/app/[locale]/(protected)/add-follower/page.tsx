"use client";

import {
  checkUser,
  PlatformType,
  UserSearchResult,
} from "@/app/actions/check-user";
import { follow } from "@/app/actions/followers";
import { trackEvent } from "@/app/lib/analytics";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconUserPlus,
  IconUserQuestion,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import { useActionState, useEffect, useState, useTransition } from "react";
import AddFollowerForm from "../components/add-follower-form";

export default function AddPage() {
  const t = useTranslations("protected.addFollowerForm");
  const router = useRouter();
  const searchParams = useSearchParams();

  const username = searchParams.get("username");
  const type = searchParams.get("type") as PlatformType | null;

  const [user, setUser] = useState<UserSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(!!username && !!type);
  const [error, setError] = useState<string | null>(null);

  const [state, formAction] = useActionState(follow, null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!username || !type) return;

    const searchUser = async () => {
      setIsLoading(true);
      setError(null);

      const result = await checkUser(username, type);

      if (result.success && result.user) {
        setUser(result.user);
      } else {
        setError(result.error || t("search.notFound"));
      }

      setIsLoading(false);
    };

    searchUser();
  }, [username, type, t]);

  useEffect(() => {
    if (state?.success) {
      notifications.show({
        title: t("actions.successTitle"),
        message: t("actions.successMessage", { username: state.username }),
        color: "green",
        icon: <IconCheck size={16} />,
      });
      router.push(`/${type}/${username}`);
    }

    if (state?.error) {
      notifications.show({
        title: t("actions.errorTitle"),
        message: state.error,
        color: "red",
      });
    }
  }, [state, t, router, type, username]);

  const handleFollow = () => {
    if (!user) return;

    trackEvent("follow", {
      platform: user.type,
      username: user.username,
    });

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("type", user.type);

    startTransition(() => {
      formAction(formData);
    });
  };

  // No params - show normal form
  if (!username || !type) {
    return <AddFollowerForm />;
  }

  // Loading
  if (isLoading) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">{t("search.searching", { platform: type })}</Text>
        </Stack>
      </Center>
    );
  }

  // Not found
  if (error || !user) {
    return (
      <Stack gap="lg">
        <Card withBorder p="lg">
          <Stack align="center" gap="md">
            <IconX size={48} color="var(--mantine-color-red-6)" />
            <Title order={3}>{t("notFollowing.notFoundTitle")}</Title>
            <Text c="dimmed" ta="center">
              {t("notFollowing.notFoundDescription", {
                username,
                platform: type,
              })}
            </Text>
          </Stack>
        </Card>

        <Text ta="center" c="dimmed" size="sm">
          {t("notFollowing.trySearch")}
        </Text>

        <Flex align="center" justify="center">
          <Box maw={300}>
            <AddFollowerForm />
          </Box>
        </Flex>
      </Stack>
    );
  }

  // Found - show follow prompt
  return (
    <Card withBorder p="lg">
      <Stack align="center" gap="lg">
        <IconUserQuestion size={32} color="var(--mantine-color-yellow-6)" />

        <Title order={3} ta="center">
          {t("notFollowing.title")}
        </Title>

        <Text c="dimmed" ta="center" size="sm">
          {t("notFollowing.description")}
        </Text>

        <Avatar
          src={`/api/image/${user.avatar}`}
          alt={user.nickname}
          size={120}
        />

        <Stack align="center" gap="xs">
          <Text fw={600} size="xl">
            {user.nickname}
          </Text>
          <Text c="dimmed">@{user.username}</Text>
          <Badge variant="light" size="lg">
            {user.type}
          </Badge>
        </Stack>

        <Text ta="center" size="sm">
          {t("notFollowing.followToAccess")}
        </Text>

        <Group>
          <Button
            variant="outline"
            color="gray"
            onClick={() => router.push("/following")}
            disabled={isPending}
          >
            {t("actions.cancel") || "Cancel"}
          </Button>
          <Button
            leftSection={<IconUserPlus size={18} />}
            onClick={handleFollow}
            loading={isPending}
          >
            {t("actions.follow")}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
