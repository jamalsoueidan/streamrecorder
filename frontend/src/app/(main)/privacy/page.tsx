"use client";
import {
  Container,
  Divider,
  Group,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconDatabase,
  IconLock,
  IconServer,
  IconTrash,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

export default function PrivacyPolicy() {
  const lastUpdated = "December 25, 2025";

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>Privacy Policy</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Last updated: {lastUpdated}
          </Text>
        </div>

        <Paper withBorder p="lg" radius="md">
          <Group gap="xs" mb="sm">
            <ThemeIcon variant="light" size="lg" color="green">
              <IconLock size={20} />
            </ThemeIcon>
            <Title order={3}>Overview</Title>
          </Group>
          <Text>
            {
              "We keep things simple. We collect minimal data and don't track you. No analytics, no selling data to third parties."
            }
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Group gap="xs" mb="sm">
            <ThemeIcon variant="light" size="lg" color="blue">
              <IconDatabase size={20} />
            </ThemeIcon>
            <Title order={3}>What We Collect</Title>
          </Group>
          <Text mb="md">When you create an account, we store:</Text>
          <List spacing="sm">
            <List.Item>
              <Text component="span" fw={500}>
                Email address
              </Text>
              <Text c="dimmed" size="sm">
                {" "}
                — to let you log in and recover your account
              </Text>
            </List.Item>
            <List.Item>
              <Text component="span" fw={500}>
                Username
              </Text>
              <Text c="dimmed" size="sm">
                {" "}
                — to identify your account
              </Text>
            </List.Item>
            <List.Item>
              <Text component="span" fw={500}>
                Last login date
              </Text>
              <Text c="dimmed" size="sm">
                {" "}
                — for basic account management
              </Text>
            </List.Item>
            <List.Item>
              <Text component="span" fw={500}>
                Streamers you follow
              </Text>
              <Text c="dimmed" size="sm">
                {"— to show you content from streamers you're interested in"}
              </Text>
            </List.Item>
          </List>
          <Text mt="md" c="dimmed" size="sm">
            {"That's it. Nothing else."}
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Group gap="xs" mb="sm">
            <ThemeIcon variant="light" size="lg" color="violet">
              <IconServer size={20} />
            </ThemeIcon>
            <Title order={3}>Where Your Data Is Stored</Title>
          </Group>
          <Text>Our servers are located in Europe.</Text>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Group gap="xs" mb="sm">
            <ThemeIcon variant="light" size="lg" color="teal">
              <IconUsers size={20} />
            </ThemeIcon>
            <Title order={3}>Third Parties</Title>
          </Group>
          <Text>We do not share your data with anyone.</Text>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Group gap="xs" mb="sm">
            <ThemeIcon variant="light" size="lg" color="orange">
              <IconUserCheck size={20} />
            </ThemeIcon>
            <Title order={3}>Your Rights</Title>
          </Group>
          <Text>You have the right to:</Text>
          <List spacing="xs" mt="sm">
            <List.Item>Access your data</List.Item>
            <List.Item>Correct your data</List.Item>
            <List.Item>
              Delete your account and all associated data at any time
            </List.Item>
          </List>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Group gap="xs" mb="sm">
            <ThemeIcon variant="light" size="lg" color="red">
              <IconTrash size={20} />
            </ThemeIcon>
            <Title order={3}>Delete Your Account</Title>
          </Group>
          <Text>
            To delete your account, go to{" "}
            <Text component="span" fw={600}>
              Settings → Delete Account
            </Text>
            .
          </Text>
          <Text mt="xs" c="dimmed" size="sm">
            Once deleted, all your data is permanently removed from our servers.
          </Text>
        </Paper>

        <Divider my="sm" />

        <Text size="sm" c="dimmed" ta="center">
          {"If we update this policy, we'll post changes here with a new date."}
        </Text>
      </Stack>
    </Container>
  );
}
