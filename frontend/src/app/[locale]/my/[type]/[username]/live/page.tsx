import { getUser } from "@/app/actions/user";
import { Container, Stack, Text, Title } from "@mantine/core";
import { notFound } from "next/navigation";
import { LivePlayer } from "./components/live-player";

interface PageProps {
  params: Promise<{
    type: string;
    username: string;
  }>;
}

const STREAM_HOST =
  process.env.NEXT_PUBLIC_STREAM_HOST || "https://stream.livestreamrecorder.com";

// Verified by probing n8n live-status-check / the worker for a currently-live
// user per platform: tiktok, trovo, buzzcast, nimotv serve FLV (Enhanced-FLV
// with HEVC for tiktok). NimoTV verified 2026-05-26 via
// stream.livestreamrecorder.com/nimotv/5928797/index.m3u8 → Content-Type
// video/x-flv. live17/kwai/vklive NOT yet verified — assumed HLS until
// confirmed otherwise.
const PLATFORM_LIVE_FORMAT: Record<string, "flv" | "hls"> = {
  tiktok: "flv",
  trovo: "flv",
  buzzcast: "flv",
  nimotv: "flv",
};

export default async function LivePage({ params }: PageProps) {
  const user = await getUser();
  // Live preview is paid-only — block free users (role.type === "authenticated").
  if (user?.data?.role?.type === "authenticated" || !user?.data?.role?.type) {
    notFound();
  }

  const { type, username } = await params;
  const decoded = decodeURIComponent(username);
  const encoded = encodeURIComponent(decoded);
  const format = PLATFORM_LIVE_FORMAT[type] ?? "hls";
  const ext = format === "flv" ? "index.flv" : "index.m3u8";
  const src = `${STREAM_HOST}/${type}/${encoded}/${ext}`;

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Stack gap={2}>
          <Title order={2}>{decoded}</Title>
          <Text size="sm" c="dimmed">
            {type} · live preview
          </Text>
        </Stack>
        <LivePlayer src={src} format={format} />
      </Stack>
    </Container>
  );
}
