import { Container, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { DMCAForm } from "./components/form";

export default function DMCAPolicy() {
  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <div>
          <Group gap="xs" mb="xs">
            <ThemeIcon variant="light" size="lg" color="blue">
              <IconScale size={20} />
            </ThemeIcon>
            <Title order={1}>Digital Millennium Copyright Act</Title>
          </Group>
          <Text c="dimmed">DMCA Policy</Text>
        </div>
        <DMCAForm />
        <Text size="sm" c="dimmed" ta="center">
          We respond to all valid DMCA requests. Abuse of this process may
          result in legal consequences.
        </Text>
      </Stack>
    </Container>
  );
}
