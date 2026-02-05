"use client";

import {
  checkUser,
  PlatformType,
  UserSearchResult,
} from "@/app/actions/check-user";
import { follow } from "@/app/actions/followers";
import { trackEvent } from "@/app/lib/analytics";
import { parseUsername } from "@/app/lib/parse-username";
import { streamingPlatforms } from "@/app/lib/streaming-platforms";

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconClipboard,
  IconSearch,
  IconUsersPlus,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";

const ALL_PLATFORMS: PlatformType[] = [
  "tiktok",
  "twitch",
  "kick",
  "youtube",
  "afreecatv",
  "pandalive",
];

export default function Page() {
  const t = useTranslations("protected.search");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 500);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [state, formAction] = useActionState(follow, null);
  const [isPending, startTransition] = useTransition();

  // Search for user when debounced query changes
  useEffect(() => {
    let cancelled = false;

    const searchUser = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length === 0) {
        setSearchResults([]);
        setSearchError(null);
        return;
      }

      setIsSearching(true);
      setSearchError(null);
      setSearchResults([]);

      const parsed = parseUsername(debouncedQuery);

      if (!parsed.username) {
        setSearchError(t("search.parseError"));
        setIsSearching(false);
        return;
      }

      // If URL detected, search only that platform. Otherwise search all.
      const platformsToSearch = parsed.platform
        ? [parsed.platform]
        : ALL_PLATFORMS;

      let completedCount = 0;
      let foundAny = false;

      const promises = platformsToSearch.map(async (platform) => {
        try {
          const result = await checkUser(parsed.username, platform);
          if (cancelled) return;

          if (result.success && result.user) {
            foundAny = true;
            setSearchResults((prev) => [...prev, result.user!]);
          }
        } finally {
          completedCount++;
          if (completedCount === platformsToSearch.length && !cancelled) {
            setIsSearching(false);
            if (!foundAny) {
              setSearchError(t("search.notFound"));
            }
          }
        }
      });

      await Promise.allSettled(promises);
    };

    searchUser();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, t]);

  // Handle follow success/error notifications
  useEffect(() => {
    if (state?.success) {
      notifications.show({
        title: t("actions.successTitle"),
        message: t("actions.successMessage", { username: state.username }),
        color: "green",
        icon: <IconCheck size={16} />,
      });

      router.push(`/${state.type}/${state.username}`);
    }

    if (state?.error) {
      notifications.show({
        title: t("actions.errorTitle"),
        message: state.error,
        color: "red",
      });
    }
  }, [router, state, t]);

  // Handle clicking on a user result
  const handleUserSelect = (user: UserSearchResult) => {
    trackEvent("follow", {
      platform: user.type,
    });

    setQuery("");
    setSearchResults([]);

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("type", user.type);

    startTransition(() => {
      formAction(formData);
    });
  };

  // Render the search results
  const renderContent = () => {
    if (query.trim().length === 0) return null;

    // Show hint if input looks invalid
    if (
      !isSearching &&
      searchResults.length === 0 &&
      !searchError &&
      (query.includes(" ") || query.length > 30)
    ) {
      return (
        <Stack align="center" gap="xs" py="md">
          <Text size="xs" c="dimmed">
            {t("hints.enterUsername")}
          </Text>
          <Text size="xs" c="dimmed">
            @mrbeast
          </Text>
          <Text size="xs" c="dimmed">
            twitch.tv/mrbeast
          </Text>
          <Text size="xs" c="dimmed">
            https://www.tiktok.com/@mrbeast
          </Text>
        </Stack>
      );
    }

    return (
      <Stack w="100%">
        {searchResults.map((user) => (
          <UnstyledButton
            key={`${user.type}-${user.username}`}
            onClick={() => handleUserSelect(user)}
            disabled={isPending}
            w="100%"
          >
            <Paper p="sm" radius="lg" withBorder>
              <Group wrap="nowrap" w="100%">
                <Avatar
                  src={`/api/image/${user.avatar}`}
                  alt={user.nickname}
                  size={60}
                />

                <div style={{ flex: 1 }}>
                  <Text fw={500}>{user.nickname}</Text>
                  <Text opacity={0.6} size="xs">
                    @{user.username}
                  </Text>
                  <Badge variant="outline" color="white">
                    {t(`platforms.${user.type}`)}
                  </Badge>
                </div>

                <Badge
                  variant="filled"
                  size="lg"
                  leftSection={<IconUsersPlus size={18} />}
                  style={{ pointerEvents: "none" }}
                >
                  {t("actions.follow")}
                </Badge>
              </Group>
            </Paper>
          </UnstyledButton>
        ))}

        {isSearching && (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        )}

        {!isSearching && searchError && searchResults.length === 0 && (
          <Text size="sm" c="dimmed" ta="center" py="md">
            {searchError}
          </Text>
        )}
      </Stack>
    );
  };

  return (
    <Stack w="100%">
      <Group justify="space-between" w="100%">
        <Stack gap={2}>
          <Group gap="xs">
            <IconSearch size={32} />
            <Title order={1} size="h3">
              {t("title")}
            </Title>
          </Group>
          <Text size="xs" c="dimmed">
            {t("description")}
          </Text>
        </Stack>
        <Group gap="lg" justify="center">
          {streamingPlatforms.map((platform) => (
            <Tooltip key={platform.name} label={platform.name}>
              <Image
                src={platform.file}
                alt={platform.name}
                w={24}
                h={24}
                style={{ opacity: 0.5, filter: "brightness(0) invert(1)" }}
              />
            </Tooltip>
          ))}
        </Group>
      </Group>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      <Card
        p={{ base: "xs", sm: "lg" }}
        radius="lg"
        withBorder
        bg="transparent"
      >
        <Stack>
          <TextInput
            w="100%"
            value={query}
            c="white"
            size="lg"
            radius="lg"
            autoFocus
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder={t("search.placeholder")}
            rightSectionPointerEvents="auto"
            rightSectionWidth={query.trim().length === 0 ? 100 : 42}
            rightSection={
              query.trim().length === 0 ? (
                <Button
                  variant="subtle"
                  size="compact-lg"
                  color="gray.6"
                  leftSection={<IconClipboard size={14} />}
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text?.trim()) {
                        setQuery(text);
                      }
                    } catch {
                      notifications.show({
                        message: t("search.pasteError"),
                        color: "yellow",
                      });
                    }
                  }}
                >
                  {t("search.pasteButton")}
                </Button>
              ) : (
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  radius="xl"
                  color="gray.6"
                  onClick={() => setQuery("")}
                >
                  <IconX />
                </ActionIcon>
              )
            }
          />

          <Group gap="xs">
            <Text size="xs" c="dimmed">
              {t("hints.tryFormats")}
            </Text>
            <Badge
              variant="outline"
              style={{ cursor: "pointer" }}
              onClick={() => setQuery("mrbeast")}
            >
              mrbeast
            </Badge>
            <Badge
              variant="outline"
              style={{ cursor: "pointer" }}
              onClick={() => setQuery("https://www.tiktok.com/@mrbeast")}
            >
              https://www.tiktok.com/@mrbeast
            </Badge>
          </Group>
        </Stack>
      </Card>

      {renderContent()}
    </Stack>
  );
}
