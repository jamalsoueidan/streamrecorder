"use client";
import {
  Anchor,
  Badge,
  Container,
  Divider,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMatches,
} from "@mantine/core";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  const gap = useMatches({
    base: 30,
    sm: 50,
    md: 50,
  });

  const data = [
    {
      title: t("featuredCreators.title"),
      links: [
        { label: t("featuredCreators.browse"), link: "/creators/all" },
        { label: t("featuredCreators.tiktok"), link: "/creators/tiktok" },
        { label: t("featuredCreators.twitch"), link: "/creators/twitch" },
        { label: t("featuredCreators.kick"), link: "/creators/kick" },
        { label: t("featuredCreators.youtube"), link: "/creators/youtube" },
        { label: t("featuredCreators.afreecatv"), link: "/creators/afreecatv" },
        { label: t("featuredCreators.pandalive"), link: "/creators/pandalive" },
      ],
    },
    {
      title: t("watchRecordings.title"),
      links: [
        { label: t("watchRecordings.browse"), link: "/recordings/all" },
        { label: t("watchRecordings.tiktok"), link: "/recordings/tiktok" },
        { label: t("watchRecordings.twitch"), link: "/recordings/twitch" },
        { label: t("watchRecordings.kick"), link: "/recordings/kick" },
        { label: t("watchRecordings.youtube"), link: "/recordings/youtube" },
        {
          label: t("watchRecordings.afreecatv"),
          link: "/recordings/afreecatv",
        },
        {
          label: t("watchRecordings.pandalive"),
          link: "/recordings/pandalive",
        },
      ],
    },
    {
      title: t("legal.title"),
      links: [
        { link: "/privacy", label: t("legal.privacy") },
        { link: "/terms", label: t("legal.terms") },
        { link: "/dmca", label: t("legal.dmca") },
      ],
    },
    {
      title: t("company.title"),
      links: [
        { link: "/news", label: t("company.news") },
        //{ link: "/pricing", label: t("company.pricing") },
        { link: "/faq", label: t("company.faq") },
        { link: "/changelog", label: t("company.updates") },
        { link: "/sitemap.xml", label: t("company.sitemap") },
        { link: "/contact", label: t("company.contact") },
      ],
    },
  ];

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
      <Image src="/logo2.svg" alt="Logo" maw="100%" mt={30} />
      <Divider c="white" size="xl" mb={20} visibleFrom="sm" />
      <Container size="xl" py="xl" mt={20}>
        <SimpleGrid cols={{ base: 1, sm: 3, md: 5 }} mb="xl">
          <Stack>
            <Anchor component="a" href="/" c="white" underline="never">
              <Group gap="xs">
                <Badge
                  size="md"
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
                <Title order={2} size="h4">
                  StreamRecorder
                </Title>
              </Group>
            </Anchor>
            <Text size="sm" c="dimmed">
              {t("tagline")}
            </Text>
          </Stack>

          {groups}
        </SimpleGrid>

        <Stack mt="xl">
          <Text c="dimmed" size="xs" fw="bold">
            {t("copyright")}
          </Text>
          <Text c="dimmed" size="xs">
            {t("copyright_text")} {t("association")}
          </Text>
        </Stack>
      </Container>
    </footer>
  );
}
