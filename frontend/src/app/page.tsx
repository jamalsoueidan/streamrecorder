import { getToken } from "@/lib/token";
import { Alert, Button, Group, Text, Title } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

export default async function Home() {
  const token = await getToken();
  const isLoggedIn = !!token;

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "100px auto",
        padding: 20,
        textAlign: "center",
      }}
    >
      <Title>Stream Recorder</Title>
      <Text c="dimmed">Record your favourite streamers</Text>

      <Alert
        icon={<IconHeart size="xl" />}
        title="We've moved to a new platform! (22
          december 2025)"
        color="blue"
        mt="xl"
        mb="xl"
        pb="lg"
        pt="lg"
        style={{ textAlign: "left" }}
      >
        <Text size="sm">
          ✓ Your followed streamers are safe and will still be recorded.
        </Text>
        <Text size="sm">✓ Recordings now in original + multiple qualities</Text>
        <Text size="sm">✓ Completely redesigned UI</Text>
        <Text size="sm" mt="xs">
          ✗ Accounts were reset — please create a new one
        </Text>
        <Text size="sm">✗ Previous recordings were deleted</Text>
        <Text size="sm" c="dimmed" mt="sm">
          Sorry for any inconvenience. Thanks for sticking with us!
        </Text>
      </Alert>

      <Group justify="center">
        {isLoggedIn ? (
          <Button component="a" href="/following" size="xl">
            Go to Dashboard
          </Button>
        ) : (
          <>
            <Button component="a" href="/login" size="xl">
              Login
            </Button>
            <Button component="a" href="/register" variant="subtle" size="xl">
              Register
            </Button>
          </>
        )}
      </Group>
    </div>
  );
}
