import { Group, Stack, Text, Title } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { getRecordingsByIds } from "./actions";
import { ClearWatchLaterButton } from "./components/clear-watch-later-button";
import { WatchLaterTheater } from "./components/watch-later-theater";
import { getWatchLaterIds } from "./lib/get-watch-later-ids";

export default async function Page() {
  const t = await getTranslations("protected.watchLater");
  const watchLaterIds = await getWatchLaterIds();

  // Fetch all queued recordings up-front. The right-side queue needs the full
  // list visible so users can jump anywhere; the cookie is bounded in practice
  // so this is a single Strapi round-trip.
  const initialRecordings =
    watchLaterIds.length > 0 ? await getRecordingsByIds(watchLaterIds) : [];

  return (
    <Stack w="100%" gap="md">
      <Group justify="space-between" w="100%">
        <Stack gap={2}>
          <Group gap="xs">
            <IconClock size={28} />
            <Title order={1} size="h4">
              {t("title")}
            </Title>
          </Group>
          <Text size="xs" c="dimmed">
            {t("description")}
          </Text>
        </Stack>
        <ClearWatchLaterButton initialCount={watchLaterIds.length} />
      </Group>

      <WatchLaterTheater
        initialIds={watchLaterIds}
        initialRecordings={initialRecordings}
      />
    </Stack>
  );
}
