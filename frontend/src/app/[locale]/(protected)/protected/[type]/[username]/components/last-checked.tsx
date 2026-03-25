"use client";

import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { IconClock, IconLoader } from "@tabler/icons-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { fetchLastChecked } from "../actions/fetch-last-checked";

export function useLastChecked(username: string, type: string) {
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { lastCheckedAt } = await fetchLastChecked(username, type);
    setLastCheckedAt(lastCheckedAt);
    setLoading(false);
  };

  return { lastCheckedAt, loading, fetch };
}

export function LastCheckedButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  const t = useTranslations("protected.profile");

  return (
    <Tooltip label={t("checkLastChecked")}>
      <ActionIcon size="lg" onClick={onClick}>
        {loading ? <IconLoader size={24} /> : <IconClock size={24} />}
      </ActionIcon>
    </Tooltip>
  );
}

export function LastCheckedText({ value }: { value: string | null }) {
  const t = useTranslations("protected.profile");
  const format = useFormatter();

  return (
    <Text
      size="sm"
      c="dimmed"
      suppressHydrationWarning
      style={{ minHeight: 20 }}
    >
      {value
        ? t("lastCheckedAgo", {
            time: format.relativeTime(new Date(value), new Date()),
          })
        : "\u00A0"}
    </Text>
  );
}
