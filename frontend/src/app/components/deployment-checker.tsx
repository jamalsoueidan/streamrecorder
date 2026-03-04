"use client";

import { Button, Flex, Overlay, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const POLL_INTERVAL = 30_000;
const CLIENT_BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID;

export function DeploymentChecker() {
  const t = useTranslations("common.newVersion");
  const [hasNewVersion, setHasNewVersion] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/build-id");
        const { buildId } = await res.json();
        if (buildId && buildId !== CLIENT_BUILD_ID) {
          setHasNewVersion(true);
        }
      } catch {
        // ignore fetch errors
      }
    };

    const interval = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(interval);
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
