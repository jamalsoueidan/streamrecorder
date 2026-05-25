import Link from "@/app/components/link";
import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import { Box, Image, Marquee, Stack, Text } from "@mantine/core";

const NEW_PLATFORMS = new Set<string>(["Live17", "Kwai", "Nimotv", "Vklive"]);
// Special "featured" platforms — get a gold pulse animation instead of the
// regular purple "new" one. Use sparingly.
const SPECIAL_PLATFORMS = new Set<string>([]);

// Where each platform's streamers mostly come from — purely a visual hint
// on the dashboard, not used for filtering or anything else.
const PLATFORM_FLAGS: Record<string, string[]> = {
  TikTok: ["🌍"],
  Twitch: ["🌍"],
  Kick: ["🌍"],
  YouTube: ["🌍"],
  AfreecaTV: ["🇰🇷"],
  Pandalive: ["🇰🇷"],
  Bigo: ["🌍"],
  Buzzcast: ["🌍"],
  LiveMe: ["🌍"],
  Mixch: ["🇯🇵"],
  Twitcast: ["🇯🇵"],
  Trovo: ["🇷🇺", "🇧🇷"],
  Joilive: ["🇨🇳", "🇹🇼"],
  Live17: ["🇹🇼", "🇯🇵", "🇭🇰"],
  Kwai: ["🇧🇷", "🇮🇩", "🇲🇽"],
  Nimotv: ["🇧🇷", "🇮🇩", "🇹🇭"],
  Vklive: ["🇷🇺"],
};

export function PlatformsSection() {
  return (
    <Marquee py="lg" gap="md" duration={30000} pauseOnHover>
      {[...streamingPlatforms].reverse().map((platform) => {
        const isSpecial = SPECIAL_PLATFORMS.has(platform.name);
        const isNew = NEW_PLATFORMS.has(platform.name);
        const type = platform.name.toLowerCase();
        return (
          <Link
            key={platform.name}
            href={`/my/explore?type=${type}`}
            style={{ textDecoration: "none", flexShrink: 0 }}
          >
            <Stack
              pos="relative"
              align="center"
              justify="center"
              gap={8}
              px="lg"
              py="md"
              h={120}
              style={{
                borderRadius: "var(--mantine-radius-lg)",
                border: isSpecial
                  ? "1px solid rgba(251, 191, 36, 0.45)"
                  : isNew
                    ? "1px solid rgba(139, 92, 246, 0.35)"
                    : "1px solid rgba(255,255,255,0.1)",
                background: isSpecial
                  ? "rgba(251, 191, 36, 0.10)"
                  : isNew
                    ? "rgba(139, 92, 246, 0.08)"
                    : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                minWidth: 100,
                animation: isSpecial
                  ? "pulseGold 2.4s ease-in-out infinite"
                  : isNew
                    ? "pulseNew 2.4s ease-in-out infinite"
                    : undefined,
              }}
            >
              {isNew && (
                <Box
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background:
                      "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
                    color: "white",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    boxShadow: "0 0 12px rgba(139, 92, 246, 0.7)",
                    animation: "newBadgeBounce 1.8s ease-in-out infinite",
                    zIndex: 1,
                  }}
                >
                  NEW
                </Box>
              )}
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
              {PLATFORM_FLAGS[platform.name] && (
                <Text fz={20} style={{ lineHeight: 1, letterSpacing: 2 }}>
                  {PLATFORM_FLAGS[platform.name].join(" ")}
                </Text>
              )}
            </Stack>
          </Link>
        );
      })}
    </Marquee>
  );
}
