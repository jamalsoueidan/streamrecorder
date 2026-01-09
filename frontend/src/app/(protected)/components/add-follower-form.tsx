"use client";

import {
  checkUser,
  PlatformType,
  UserSearchResult,
} from "@/app/actions/check-user";
import { follow } from "@/app/actions/followers";
import { parseUsername } from "@/app/lib/parse-username";

import {
  Avatar,
  Badge,
  Button,
  Center,
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
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";

export default function AddFollowerForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 500);
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformType>("tiktok");
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformType | null>(
    null
  );
  const [searchResult, setSearchResult] = useState<UserSearchResult | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState(follow, null);
  const [isPending, startTransition] = useTransition();

  // The effective platform: use detected (from URL) if available, otherwise use selected
  const effectivePlatform = detectedPlatform ?? selectedPlatform;

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
        setSearchError("Could not parse username");
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
        setSearchError(result.error || "User not found");
      }

      setIsSearching(false);
    };

    searchUser();
  }, [debouncedQuery, selectedPlatform]);

  // Handle follow success/error notifications
  useEffect(() => {
    if (state?.success) {
      notifications.show({
        title: "Followed!",
        message: `You are now following ${state.username}`,
        color: "green",
        icon: <IconCheck size={16} />,
      });
    }

    if (state?.error) {
      notifications.show({
        title: "Error",
        message: state.error,
        color: "red",
      });
    }
  }, [state]);

  // Handle clicking on a user result
  const handleUserSelect = (user: UserSearchResult) => {
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
              Searching on {effectivePlatform}...
            </Text>
          </Group>
        </Center>
      );
    }

    // Show error or empty state
    if (!searchResult) {
      if (query.trim().length === 0) {
        return <Spotlight.Empty></Spotlight.Empty>;
      }

      if (searchError) {
        return <Spotlight.Empty>{searchError}</Spotlight.Empty>;
      }

      return <Spotlight.Empty>Nothing found...</Spotlight.Empty>;
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
              src={searchResult.avatar}
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
            {/* Add this */}
            <Badge
              variant="filled"
              color="red"
              size="xl"
              leftSection={<IconUsersPlus size={28} />}
            >
              Follow
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
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: "16px 16px 0 0",
              maxHeight: "80dvh",
            }),
          },
        }}
      >
        <Spotlight.Search
          placeholder="Enter creators name or link"
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
                  const text = await navigator.clipboard.readText();
                  if (text?.trim()) {
                    setQuery(text);
                  }
                } catch {
                  notifications.show({
                    message: "Paste manually using Ctrl+V or long-press",
                    color: "yellow",
                  });
                }
              }}
            >
              Paste
            </Button>
          }
        />

        {/* Move SegmentedControl here, after Search */}
        <Stack gap="0" p="xs">
          <SegmentedControl
            value={detectedPlatform ?? selectedPlatform}
            onChange={(value) => setSelectedPlatform(value as PlatformType)}
            disabled={detectedPlatform !== null}
            data={[
              { label: "TikTok", value: "tiktok" },
              { label: "Twitch", value: "twitch" },
              { label: "Kick", value: "kick" },
              { label: "Youtube", value: "youtube" },
            ]}
            fullWidth
          />
          {detectedPlatform && (
            <Text size="xs" c="dimmed" ta="center" my="xs">
              Platform auto-detected from URL
            </Text>
          )}
        </Stack>

        <Spotlight.ActionsList>{renderContent()}</Spotlight.ActionsList>
      </Spotlight.Root>

      <UnstyledButton onClick={spotlight.open} w="100%">
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
            <Text c="gray.3">Enter creators name or link</Text>
          </Group>
        </Paper>
      </UnstyledButton>
    </section>
  );
}
