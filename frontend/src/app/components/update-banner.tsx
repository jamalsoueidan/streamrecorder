"use client";

import { Button, Group, Paper, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function UpdateBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Check if this is a server action (has next-action header)
      const request = args[0];
      const options = args[1] as RequestInit | undefined;
      const isServerAction =
        (request instanceof Request && request.headers.get("next-action")) ||
        (options?.headers &&
          (options.headers as Record<string, string>)["next-action"]);

      if (isServerAction && !response.ok) {
        try {
          const cloned = response.clone();
          const text = await cloned.text();
          if (
            text.includes("Failed to find Server Action") ||
            text.includes("older or newer deployment")
          ) {
            setShow(true);
          }
        } catch {}
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (!show) return null;

  return (
    <Paper
      pos="fixed"
      top={0}
      left={0}
      right={0}
      p="sm"
      bg="blue"
      style={{ zIndex: 9999 }}
    >
      <Group justify="center" gap="md">
        <Text c="white" fw={500}>
          A new version is available
        </Text>
        <Button
          size="xs"
          variant="white"
          leftSection={<IconRefresh size={16} />}
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Group>
    </Paper>
  );
}
