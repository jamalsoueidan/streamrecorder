"use client";
import {
  Anchor,
  Badge,
  Container,
  Group,
  Stack,
  Text,
  Title,
  useMatches,
} from "@mantine/core";

const data = [
  {
    title: "Featured Creators",
    links: [
      { label: "Browse creators", link: "/creators" },
      { label: "Tiktok creators", link: "/tiktok" },
      { label: "Twitch creators", link: "/twitch" },
      { label: "Kick creators", link: "/kick" },
      { label: "YouTube creators", link: "/youtube" },
      { label: "AfreecaTV creators", link: "/afreecatv" },
      { label: "Pandalive creators", link: "/pandalive" },
    ],
  },
  {
    title: "Watch Recordings",
    links: [
      { label: "Browse recordings", link: "/recordings/all" },
      { label: "Tiktok recordings", link: "/recordings/tiktok" },
      { label: "Twitch recordings", link: "/recordings/twitch" },
      { label: "Kick recordings", link: "/recordings/kick" },
      { label: "YouTube recordings", link: "/recordings/youtube" },
      { label: "AfreecaTV recordings", link: "/recordings/afreecatv" },
      { label: "Pandalive recordings", link: "/recordings/pandalive" },
    ],
  },
  {
    title: "Legal",
    links: [
      { link: "/privacy", label: "Privacy Policy" },
      { link: "/terms", label: "Terms & Conditions" },
      { link: "/dmca", label: "DMCA policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { link: "/news", label: "News" },
      { link: "/pricing", label: "Pricing" },
      { link: "/faq", label: "FAQ" },
      { link: "/product-updates", label: "Updates" },
      { link: "/sitemap.xml", label: "Sitemap" },
      { link: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  const gap = useMatches({
    base: 30,
    sm: 50,
    md: 50,
  });

  const groups = data.map((group) => (
    <Stack key={group.title} gap="xs">
      <Text fw={500} size="sm" c="dimmed">
        {group.title}
      </Text>
      {group.links.map((link) => (
        <Anchor
          key={link.label}
          component="a"
          href={link.link}
          size="md"
          c="white"
        >
          {link.label}
        </Anchor>
      ))}
    </Stack>
  ));

  return (
    <footer>
      <Container size="lg" py="xl" mt={120}>
        <Group justify="space-between" align="flex-start">
          {/* Logo & description - left side */}
          <Stack gap="xs">
            <Anchor component="a" href="/" c="white" underline="never">
              <Group>
                <Badge
                  size="lg"
                  c="white"
                  bg="red"
                  radius="xs"
                  style={{
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#ffffff",
                        animation: "blink 1s ease-in-out infinite",
                      }}
                    />
                    <span
                      style={{
                        letterSpacing: "0.5px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        textShadow: "0 0 1px rgba(255,255,255,0.5)",
                      }}
                    >
                      Live
                    </span>
                  </span>
                </Badge>
                <Title order={3}>StreamRecorder</Title>
              </Group>
            </Anchor>
            <Text size="sm" c="dimmed">
              Never miss a live stream again
            </Text>
          </Stack>

          {/* Link groups - right side, close together */}
          <Group gap={gap} align="flex-start" px={gap}>
            {groups}
          </Group>
        </Group>

        {/* Bottom section */}
        <Group
          justify="space-between"
          mt="xl"
          pt="xl"
          style={{ borderTop: "1px solid var(--mantine-color-dark-4)" }}
        >
          <Text c="dimmed" size="sm">
            © 2026 LiveStreamRecorder.com. All rights reserved.
          </Text>
        </Group>
      </Container>
    </footer>
  );
}
