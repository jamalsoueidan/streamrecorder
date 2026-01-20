// components/empty-state.tsx
import { Stack, Text } from "@mantine/core";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Stack align="center" py="xl" gap="xs">
      <Text size="lg" fw={500}>
        {title}
      </Text>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Stack>
  );
}
