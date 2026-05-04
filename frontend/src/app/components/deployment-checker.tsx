"use client";

import { Button, Flex, Overlay, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const CLIENT_BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID;
// Poll often enough that users hit the refresh prompt before they trigger
// a server action with a stale ID. Server action IDs change on every
// deploy and Vercel doesn't keep old ones working — a stale call fails
// silently, so we have to force the user onto the new bundle ASAP.
const POLL_INTERVAL = 2 * 60_000; // 2 minutes

export function DeploymentChecker() {
  const t = useTranslations("common.newVersion");
  const [hasNewVersion, setHasNewVersion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      // Skip backgrounded tabs — they'll re-check on visibilitychange
      // when the user comes back, and we save the request in the meantime.
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

    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    const interval = setInterval(check, POLL_INTERVAL);
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
