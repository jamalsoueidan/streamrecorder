"use client";

import { Paper, Stack, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export function Submitted() {
  return (
    <Paper
      p="xl"
      radius="lg"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <Stack align="center" gap="md">
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#10b981",
          }}
        >
          <IconCheck size={30} />
        </div>
        <Title order={2} ta="center" style={{ color: "#f1f5f9" }}>
          DMCA Request Submitted
        </Title>
        <Text ta="center" style={{ color: "#94a3b8", lineHeight: 1.7 }}>
          We have received your DMCA takedown request. We will review it and
          respond to the email address you provided.
        </Text>
      </Stack>
    </Paper>
  );
}
