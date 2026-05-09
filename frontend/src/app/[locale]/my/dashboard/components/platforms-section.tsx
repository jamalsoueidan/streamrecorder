import Link from "@/app/components/link";
import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import { Group, Image, Scroller, Stack, Text } from "@mantine/core";

const NEW_PLATFORMS = new Set(["Mixch", "Twitcast", "Trovo"]);

export function PlatformsSection() {
  return (
    <Scroller px="lg" py="lg">
      <Group gap="md" wrap="nowrap">
        {[...streamingPlatforms].reverse().map((platform) => {
          const isNew = NEW_PLATFORMS.has(platform.name);
          const type = platform.name.toLowerCase();
          return (
            <Link
              key={platform.name}
              href={`/my/explore?type=${type}`}
              style={{ textDecoration: "none", flexShrink: 0 }}
            >
              <Stack
                align="center"
                justify="center"
                gap={8}
                px="lg"
                py="md"
                h={120}
                style={{
                  borderRadius: "var(--mantine-radius-lg)",
                  border: isNew
                    ? "1px solid rgba(139, 92, 246, 0.35)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: isNew
                    ? "rgba(139, 92, 246, 0.08)"
                    : "rgba(255,255,255,0.03)",
                  cursor: "pointer",
                  minWidth: 100,
                  animation: isNew
                    ? "pulseNew 2.4s ease-in-out infinite"
                    : undefined,
                }}
              >
                <Image
                  src={platform.file}
                  alt={platform.name}
                  w={36}
                  h={36}
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <Text size="sm" fw={600} c="white">
                  {platform.name}
                </Text>
              </Stack>
            </Link>
          );
        })}
      </Group>
    </Scroller>
  );
}
