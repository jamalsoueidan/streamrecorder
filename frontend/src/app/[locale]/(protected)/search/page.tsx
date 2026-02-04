"use client";

import {
  checkUser,
  PlatformType,
  UserSearchResult,
} from "@/app/actions/check-user";
import { follow } from "@/app/actions/followers";
import { trackEvent } from "@/app/lib/analytics";
import { parseUsername } from "@/app/lib/parse-username";

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  useMatches,
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

export default function Page() {
  const t = useTranslations("protected.search");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 500);
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformType>("tiktok");
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformType | null>(
    null,
  );
  const [searchResult, setSearchResult] = useState<UserSearchResult | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [state, formAction] = useActionState(follow, null);
  const [isPending, startTransition] = useTransition();

  // The effective platform: use detected (from URL) if available, otherwise use selected
  const effectivePlatform = detectedPlatform ?? selectedPlatform;

  const data = [
    { label: t("platforms.tiktok"), value: "tiktok" },
    { label: t("platforms.twitch"), value: "twitch" },
    { label: t("platforms.kick"), value: "kick" },
    { label: t("platforms.youtube"), value: "youtube" },
    { label: t("platforms.afreecatv"), value: "afreecatv" },
    { label: t("platforms.pandalive"), value: "pandalive" },
  ];

  const isMobile = useMatches({
    base: true,
    sm: false,
  });

  // Search for user when debounced query changes
  useEffect(() => {
    const searchUser = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length === 0) {
        setSearchResult(null);
        setSearchError(null);
        setDetectedPlatform(null);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      // Parse the input to extract username from URL or plain text
      const parsed = parseUsername(debouncedQuery);
      setDetectedPlatform(parsed.platform);

      if (!parsed.username) {
        setSearchResult(null);
        setSearchError(t("search.parseError"));
        setIsSearching(false);
        return;
      }

      // Use detected platform from URL, or fall back to selected platform
      const platformToUse = parsed.platform ?? selectedPlatform;

      const result = await checkUser(parsed.username, platformToUse);

      if (result.success && result.user) {
        setSearchResult(result.user);
        setSearchError(null);
      } else {
        setSearchResult(null);
        setSearchError(result.error || t("search.notFound"));
      }

      setIsSearching(false);
    };

    searchUser();
  }, [debouncedQuery, selectedPlatform, t]);

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
      platform: searchResult?.type,
    });

    setQuery("");
    setSearchResult(null);
    setDetectedPlatform(null);

    // Create FormData and call the follow action
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

    // Show loader while searching
    if (isSearching) {
      return (
        <Center py="md">
          <Group gap="xs">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">
              {t("search.searching", { platform: effectivePlatform })}
            </Text>
          </Group>
        </Center>
      );
    }

    // Show error or empty state
    if (!searchResult) {
      if (query.includes(" ") || query.length > 30) {
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

      if (searchError) {
        return (
          <Text size="sm" c="dimmed" ta="center" py="md">
            {searchError}
          </Text>
        );
      }

      return (
        <Text size="sm" c="dimmed" ta="center" py="md">
          {t("search.notFound")}
        </Text>
      );
    }

    // Show the found user
    return (
      <UnstyledButton
        onClick={() => handleUserSelect(searchResult)}
        disabled={isPending}
        w="100%"
      >
        <Paper p="sm" radius="lg" withBorder bg="blue.8">
          <Group wrap="nowrap" w="100%">
            <Center>
              <Avatar
                src={`/api/image/${searchResult.avatar}`}
                alt={searchResult.nickname}
                size={80}
              />
            </Center>

            <div style={{ flex: 1 }}>
              <Text fw={500}>{searchResult.nickname}</Text>
              <Text opacity={0.6} size="xs">
                @{searchResult.username}
              </Text>
              <Text size="md">{searchResult.type.toUpperCase()}</Text>
            </div>

            <Group gap="xs">
              <Badge
                variant="filled"
                size="xl"
                leftSection={<IconUsersPlus size={28} />}
                style={{ pointerEvents: "none" }}
              >
                {t("actions.follow")}
              </Badge>
            </Group>
          </Group>
        </Paper>
      </UnstyledButton>
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
      </Group>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      {query.trim().length === 0 && (
        <Group gap="xs">
          <Text size="xs" c="dimmed" ta="center">
            {t("hints.tryFormats")}
          </Text>
          <Badge
            variant="outline"
            style={{ cursor: "pointer" }}
            onClick={() => setQuery("@mrbeast")}
          >
            @mrbeast
          </Badge>
          <Badge
            variant="outline"
            style={{ cursor: "pointer" }}
            onClick={() => setQuery("tiktok.com/@mrbeast")}
          >
            tiktok.com/@mrbeast
          </Badge>
        </Group>
      )}

      <Card
        p="md"
        radius="lg"
        withBorder
        bg="transparent"
        style={{ borderWidth: "10px" }}
      >
        <Stack>
          <Flex gap="md">
            <TextInput
              w="100%"
              value={query}
              c="white"
              size="lg"
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
                    color="gray.6"
                    onClick={async () => {
                      setQuery("");
                    }}
                  >
                    <IconX />
                  </ActionIcon>
                )
              }
            />
            <Button variant="default" size="lg" miw="110px">
              {t("search.actionButton")}
            </Button>
          </Flex>

          <SegmentedControl
            value={detectedPlatform ?? selectedPlatform}
            onChange={(value) => setSelectedPlatform(value as PlatformType)}
            disabled={detectedPlatform !== null}
            data={data}
            fullWidth
            size={isMobile ? "xs" : "md"}
          />

          {detectedPlatform && (
            <Text size="xs" c="dimmed" ta="center">
              {t("search.autoDetected")}
            </Text>
          )}
        </Stack>
      </Card>

      <Stack w="100%">{renderContent()}</Stack>
    </Stack>
  );
}
