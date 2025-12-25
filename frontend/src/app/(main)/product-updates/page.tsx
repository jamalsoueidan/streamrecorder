import api from "@/lib/api";
import {
  Badge,
  Container,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconGitBranch, IconSparkles } from "@tabler/icons-react";
import { ChangeLogTimeline } from "./_components/change-log-timeline";

export default async function ChangelogPage() {
  const response = await api.changeLog.getChangeLogs({});

  const changelogs = response.data?.data || [];

  return (
    <Container size="md">
      <Stack align="center" gap="md" pb={60}>
        <Badge
          size="lg"
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 90 }}
          leftSection={<IconSparkles size={14} />}
        >
          Product Updates
        </Badge>
        <Title order={1} ta="center">
          Changelog
        </Title>
        <Text size="xl" c="dimmed" ta="center" maw={600}>
          Stay up to date with the latest features, improvements, and fixes.
        </Text>
      </Stack>

      {changelogs.length === 0 ? (
        <Paper p="xl" radius="lg">
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="xl" variant="light" color="gray">
              <IconGitBranch size={30} />
            </ThemeIcon>
            <Title order={3}>No changelog entries yet</Title>
            <Text c="dimmed">Check back soon for updates.</Text>
          </Stack>
        </Paper>
      ) : (
        <ChangeLogTimeline changelogs={changelogs} />
      )}
    </Container>
  );
}
