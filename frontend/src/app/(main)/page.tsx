import { getToken } from "@/lib/token";
import { Alert, Box, Button, Group, Text } from "@mantine/core";
import { IconHeart, IconTools } from "@tabler/icons-react";

export default async function Home() {
  const token = await getToken();
  const isLoggedIn = !!token;

  return (
    <Box
      display="flex"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Box maw="80%" w="100%">
        <Alert
          icon={<IconTools size="xl" />}
          title="Behind the scenes (25 December 2025)"
          color="teal"
          mb="md"
          pb="lg"
          pt="lg"
          style={{ textAlign: "left" }}
        >
          <Text size="lg">
            We&apos;ve been working hard on optimizing our recording workflow to
            eliminate broken downloads.
          </Text>
          <Text size="lg" mt="xs">
            Getting all systems to work together without failures is challenging
            work — but we&apos;re making progress!
          </Text>
          <Text size="lg" mt="xs" c="dimmed">
            Note: Some corrupted videos still occur when streamers lose internet
            connection — this is unfortunately out of our control.
          </Text>

          <Text size="lg" mt="lg">
            Stay patient, stay with us. We&apos;re building this for{" "}
            <strong>you</strong> — our loyal users. Share with friends! This
            will become a paid service eventually, but not for you. 💙
          </Text>
        </Alert>

        <Alert
          icon={<IconHeart size="xl" />}
          title="We've moved to a new platform! (22 december 2025)"
          color="blue"
          mb="xl"
          pb="lg"
          pt="lg"
          style={{ textAlign: "left" }}
        >
          <Text size="lg">
            ✓ Your followed streamers are safe and will still be recorded.
          </Text>
          <Text size="lg">
            ✓ Recordings now in original + multiple qualities
          </Text>
          <Text size="lg">✓ Completely redesigned UI</Text>
          <Text size="lg" mt="xs">
            ✗ Accounts were reset — please create a new one
          </Text>
          <Text size="lg">✗ Previous recordings were deleted</Text>
          <Text size="lg" c="dimmed" mt="lg">
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
      </Box>
    </Box>
  );
}
