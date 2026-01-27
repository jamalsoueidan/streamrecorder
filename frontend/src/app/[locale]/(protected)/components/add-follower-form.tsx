"use client";

import {
  checkUser,
  PlatformType,
  UserSearchResult,
} from "@/app/actions/check-user";
import { follow } from "@/app/actions/followers";
import { useKeyboardHeight } from "@/app/hooks/use-keyboard-height";
import { trackEvent } from "@/app/lib/analytics";
import { parseUsername } from "@/app/lib/parse-username";

import {
  Avatar,
  Badge,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  UnstyledButton,
  useMatches,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Spotlight, spotlight } from "@mantine/spotlight";
import "@mantine/spotlight/styles.css";
import {
  IconCheck,
  IconClipboard,
  IconLink,
  IconSearch,
  IconUsersPlus,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";

export default function AddFollowerForm() {
  const t = useTranslations("protected.addFollowerForm");
  const keyboardHeight = useKeyboardHeight();
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
    }

    if (state?.error) {
      notifications.show({
        title: t("actions.errorTitle"),
        message: state.error,
        color: "red",
      });
    }
  }, [searchResult?.type, state, t]);

  // Handle clicking on a user result
  const handleUserSelect = (user: UserSearchResult) => {
    trackEvent("follow", {
      platform: searchResult?.type,
      username: searchResult?.username,
    });

    spotlight.close();
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

    // Redirect to user page (adjust the path as needed)
    router.push(`/${user.type}/${user.username}`);
  };

  // Render the search results
  const renderContent = () => {
    // Show loader while searching
    if (isSearching) {
      return (
        <Center py="xl">
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
          <Spotlight.Empty>
            <Stack align="center" gap="xs">
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
          </Spotlight.Empty>
        );
      }

      if (query.trim().length === 0) {
        return <Spotlight.Empty></Spotlight.Empty>;
      }

      if (searchError) {
        return <Spotlight.Empty>{searchError}</Spotlight.Empty>;
      }

      return <Spotlight.Empty>{t("search.notFound")}</Spotlight.Empty>;
    }

    // Show the found user
    return (
      <Spotlight.Action
        onClick={() => handleUserSelect(searchResult)}
        disabled={isPending}
      >
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
            <Badge variant="light" size="md">
              {searchResult.type}
            </Badge>
          </div>

          <Group gap="xs">
            <Badge
              variant="filled"
              color="red"
              size="xl"
              leftSection={<IconUsersPlus size={28} />}
            >
              {t("actions.follow")}
            </Badge>
          </Group>
        </Group>
      </Spotlight.Action>
    );
  };

  const isMobile = useMatches({
    base: true,
    sm: false,
  });

  return (
    <section>
      <Spotlight.Root
        query={query}
        onQueryChange={setQuery}
        styles={{
          content: {
            ...(isMobile && {
              position: "fixed",
              bottom: keyboardHeight,
              left: 0,
              right: 0,
              borderRadius: "16px 16px 0 0",
              maxHeight: `calc(80dvh - ${keyboardHeight}px)`,
              transition: "bottom 0.15s ease-out, max-height 0.15s ease-out",
            }),
          },
        }}
      >
        {query.trim().length === 0 && (
          <>
            <Group justify="center" gap="xs" py="xs">
              <Text size="xs" c="dimmed" ta="center">
                {t("hints.tryFormats")}
              </Text>

              <Badge
                variant="outline"
                style={{ cursor: "pointer" }}
                onClick={() => setQuery("@username")}
              >
                @mrbeast
              </Badge>
              <Badge
                variant="outline"
                style={{ cursor: "pointer" }}
                onClick={() => setQuery("tiktok.com/@username")}
              >
                tiktok.com/@mrbeast
              </Badge>
            </Group>

            <Divider />
          </>
        )}
        <Spotlight.Search
          placeholder={t("search.placeholder")}
          leftSection={<IconSearch stroke={1.5} />}
          rightSectionPointerEvents="auto"
          rightSectionWidth={80}
          rightSection={
            <Button
              variant="subtle"
              size="compact-xs"
              color="gray.6"
              leftSection={<IconClipboard size={14} />}
              onClick={async () => {
                try {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
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
          }
        />

        {/* Move SegmentedControl here, after Search */}
        <Stack gap="0" p="xs">
          <SegmentedControl
            value={detectedPlatform ?? selectedPlatform}
            onChange={(value) => setSelectedPlatform(value as PlatformType)}
            disabled={detectedPlatform !== null}
            data={data}
            fullWidth
            size={isMobile ? "xs" : "sm"}
          />
          {detectedPlatform && (
            <Text size="xs" c="dimmed" ta="center" my="xs">
              {t("search.autoDetected")}
            </Text>
          )}
        </Stack>

        <Spotlight.ActionsList
          display={query.trim().length === 0 ? "none" : "block"}
        >
          {renderContent()}
        </Spotlight.ActionsList>
      </Spotlight.Root>

      <UnstyledButton
        onClick={() => {
          trackEvent("open-follow-search");
          spotlight.open();
        }}
        w="100%"
      >
        <Paper
          p="sm"
          radius="md"
          style={{
            cursor: "pointer",
            border: "1px solid gold",
            animation: "glow 1.5s ease-in-out 3 forwards",
          }}
        >
          <Group>
            <IconLink size={24} color="gray" />
            <Text c="gray.3">{t("inputLabel")}</Text>
          </Group>
        </Paper>
      </UnstyledButton>
    </section>
  );
}
