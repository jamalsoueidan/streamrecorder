"use client";
import {
  Alert,
  Anchor,
  Container,
  Divider,
  List,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export default function TermsAndConditions() {
  const lastUpdated = "December 25, 2025";
  const contactEmail = "contact@example.com"; // Change this

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1}>Terms and Conditions</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Last updated: {lastUpdated}
          </Text>
        </div>

        <Text>
          {
            "By using this platform, you agree to these terms. If you don't agree, please don't use the service."
          }
        </Text>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            1. Age Requirement
          </Title>
          <Text>
            You must be at least 18 years old to use this platform. By creating
            an account, you confirm that you are 18 or older.
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            2. Your Account
          </Title>
          <List spacing="xs">
            <List.Item>
              You are responsible for keeping your login credentials secure
            </List.Item>
            <List.Item>One account per person</List.Item>
            <List.Item>Provide accurate information</List.Item>
            <List.Item>
              You are responsible for all activity under your account
            </List.Item>
          </List>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            3. Your Responsibility
          </Title>
          <Text fw={500} mb="sm">
            You are fully responsible for the streamers you choose to follow and
            any content associated with them.
          </Text>
          <Text size="sm" c="dimmed">
            We do not pre-screen or monitor content. You must ensure that your
            use of this platform complies with all applicable laws and the terms
            of any third-party streaming platforms.
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            4. Prohibited Content
          </Title>
          <Text mb="sm">You may not use this platform to:</Text>
          <List spacing="xs">
            <List.Item>Follow or record minors (anyone under 18)</List.Item>
            <List.Item>
              Access content that exploits, endangers, or sexualizes minors
            </List.Item>
            <List.Item>Infringe on intellectual property rights</List.Item>
            <List.Item>Engage in any illegal activity</List.Item>
            <List.Item>Harass, stalk, or harm others</List.Item>
            <List.Item>
              Use bots or automated tools to abuse the service
            </List.Item>
          </List>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            5. Content Removal & DMCA
          </Title>
          <Text mb="sm">
            We reserve the right to remove any content or terminate any account
            at our discretion.
          </Text>
          <Text size="sm">
            If you believe content on our platform infringes your rights or
            involves a minor, contact us and we will investigate and take
            appropriate action.
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            6. Payments & Subscriptions
          </Title>
          <List spacing="xs">
            <List.Item>
              Paid plans are billed automatically until you cancel
            </List.Item>
            <List.Item>Cancel anytime in your account settings</List.Item>
            <List.Item>No refunds for unused subscription time</List.Item>
            <List.Item>
              We may change pricing with notice to existing subscribers
            </List.Item>
          </List>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            7. Termination
          </Title>
          <Text>
            We may suspend or terminate your account at any time if you violate
            these terms. You can also delete your account anytime in Settings.
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            8. Limitation of Liability
          </Title>
          <Text mb="sm">
            {
              'This platform is provided "as is" without warranties. We are not liable for:'
            }
          </Text>
          <List spacing="xs" size="sm">
            <List.Item>Content created or accessed by users</List.Item>
            <List.Item>Actions of third-party streaming platforms</List.Item>
            <List.Item>Service interruptions or technical issues</List.Item>
            <List.Item>
              Any damages arising from your use of the platform
            </List.Item>
          </List>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            9. Indemnification
          </Title>
          <Text>
            You agree to defend and hold us harmless from any claims, damages,
            or expenses arising from your use of this platform or violation of
            these terms.
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="sm">
            10. Changes
          </Title>
          <Text>
            We may update these terms. Continued use of the platform after
            changes means you accept the new terms.
          </Text>
        </Paper>

        <Divider my="sm" />

        <Alert icon={<IconAlertCircle size={16} />} color="blue">
          <Text size="sm">
            Questions or concerns?{" "}
            <Anchor href="/contact">Contact us here</Anchor>
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
}
