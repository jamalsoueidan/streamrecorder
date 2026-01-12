import {
  Avatar,
  Container,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { getFollower } from "./actions/actions";

import { CountryFlag } from "@/app/(protected)/components/country-flag";
import { FollowerTypeIcon } from "@/app/(protected)/components/follower-type-icon";
import { generateAvatarUrl } from "@/app/lib/avatar-url";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    username: string;
    type: string;
  }>;
}) {
  const { type, username } = await params;

  const follower = await getFollower({ username, type });

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Flex gap="md" align="center">
          <Avatar
            size="xl"
            radius="xl"
            src={generateAvatarUrl(follower.avatar?.url)}
            styles={{
              image: {
                transform: "scale(2)",
                objectFit: "cover",
              },
            }}
          />

          <Stack gap="0">
            <Group>
              <Title>{follower.nickname}</Title>
              <Tooltip label={follower.type}>
                <FollowerTypeIcon
                  color="transparent"
                  type={follower.type}
                  size={30}
                />
              </Tooltip>
              {follower.country && (
                <CountryFlag
                  country={follower.country}
                  countryCode={follower.countryCode}
                  size={30}
                />
              )}
            </Group>
            <Text>
              {follower.tagline ||
                `Watch ${follower.nickname}'s recorded streams anytime. Never miss a live stream — we record automatically.`}
            </Text>
          </Stack>
        </Flex>
        {children}

        {follower.description ? (
          <Stack gap="xl">
            <div>
              <Title order={2}>About {follower.nickname}</Title>
              <Text c="dimmed" size="lg" mt="sm">
                {follower.description}
              </Text>
            </div>
          </Stack>
        ) : null}

        {follower.faq ? (
          <>
            <Title order={3}>FAQ</Title>
            {follower.faq.map((item: { q: string; a: string }) => (
              <Paper
                key={item.q}
                p="md"
                radius="lg"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  cursor: "pointer",
                }}
              >
                <Flex justify="space-between" align="center" gap="md">
                  <Text fw={500} style={{ color: "#f1f5f9" }}>
                    {item.q}
                  </Text>
                </Flex>

                <Text
                  mt="md"
                  style={{
                    color: "#94a3b8",
                    lineHeight: 1.7,
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    paddingTop: 12,
                  }}
                >
                  {item.a}
                </Text>
              </Paper>
            ))}
          </>
        ) : null}
      </Stack>
    </Container>
  );
}
