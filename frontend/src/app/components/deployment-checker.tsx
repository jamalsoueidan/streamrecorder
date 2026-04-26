"use client";

import { Button, Flex, Overlay, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const POLL_INTERVAL = 10 * 60_000; // 10 minutes
const CLIENT_BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID;

export function DeploymentChecker() {
  const t = useTranslations("common.newVersion");
  const [hasNewVersion, setHasNewVersion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      // Don't poll backgrounded tabs — saves a huge fraction of requests
      // since users typically leave many tabs open.
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/build-id");
        const { buildId } = await res.json();
        if (!cancelled && buildId && buildId !== CLIENT_BUILD_ID) {
          setHasNewVersion(true);
        }
      } catch {
        // ignore fetch errors
      }
    };

    const interval = setInterval(check, POLL_INTERVAL);
    // Also check immediately when the user comes back to the tab — that's
    // when they care about a new version, not when it's hidden.
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!hasNewVersion) return null;

  return (
    <Overlay fixed zIndex={1000} backgroundOpacity={0.7} blur={4}>
      <Flex h="100%" justify="center" align="center">
        <Stack align="center" gap="md">
          <Text c="white" fw={700} size="xl" ta="center">
            {t("title")}
          </Text>
          <Button
            size="lg"
            leftSection={<IconRefresh size={20} />}
            onClick={() => window.location.reload()}
          >
            {t("refresh")}
          </Button>
        </Stack>
      </Flex>
    </Overlay>
  );
}
