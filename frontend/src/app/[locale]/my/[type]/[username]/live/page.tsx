import { Container, Stack, Text, Title } from "@mantine/core";
import { LivePlayer } from "./components/live-player";

interface PageProps {
  params: Promise<{
    type: string;
    username: string;
  }>;
}

const STREAM_HOST =
  process.env.NEXT_PUBLIC_STREAM_HOST || "https://stream.livestreamrecorder.com";

export default async function LivePage({ params }: PageProps) {
  const { type, username } = await params;
  // username is already URL-encoded in the route segment; decode then
  // re-encode to canonicalize. Keeps weird inputs (@, special chars,
  // non-ASCII) consistent for the worker.
  const decoded = decodeURIComponent(username);
  const encoded = encodeURIComponent(decoded);
  const src = `${STREAM_HOST}/${type}/${encoded}/index.flv`;

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Stack gap={2}>
          <Title order={2}>{decoded}</Title>
          <Text size="sm" c="dimmed">
            {type} · live preview
          </Text>
        </Stack>
        <LivePlayer src={src} />
        <Text size="xs" c="dimmed">
          Stream is fetched live from {type} via our proxy. If nothing plays,
          the streamer is offline or the platform is rate-limiting.
        </Text>
      </Stack>
    </Container>
  );
}
