import { Container, Stack, Text, Title } from "@mantine/core";
import { DashTestPlayer } from "./components/dash-test-player";

interface PageProps {
  params: Promise<{
    type: string;
    username: string;
    id: string;
  }>;
}

// Test page using dash.js + @hevcjs/dashjs-plugin. The plugin
// transparently transcodes HEVC → H.264 in the browser via WebCodecs +
// wasm, so browsers without native HEVC support (Chrome on Win/Linux)
// can play TikTok recordings.
//
// Browser support: Chrome / Edge / Safari ✅, Firefox ❌ (needs
// WebCodecs VideoEncoder which Firefox doesn't have yet).
export default async function DashTestPage({ params }: PageProps) {
  const { type, username, id } = await params;
  const decodedUsername = decodeURIComponent(username);

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Stack gap={2}>
          <Title order={2}>
            {decodedUsername} · {type}
          </Title>
          <Text size="sm" c="dimmed">
            Test player — dash.js + hevc.js (wasm HEVC fallback)
          </Text>
        </Stack>
        <DashTestPlayer documentId={id} />
      </Stack>
    </Container>
  );
}
