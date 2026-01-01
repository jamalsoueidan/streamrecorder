"use client";
import { Container, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export function Submitted() {
  return (
    <Container size="md" py="xl">
      <Paper withBorder p="xl" radius="md">
        <Stack align="center" gap="md">
          <ThemeIcon size={60} radius="xl" color="green">
            <IconCheck size={30} />
          </ThemeIcon>
          <Title order={2} ta="center">
            DMCA Request Submitted
          </Title>
          <Text c="dimmed" ta="center">
            We have received your DMCA takedown request. We will review it and
            respond to the email address you provided.
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
