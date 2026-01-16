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
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { navConfig } from "./nav";

export function Footer() {
  const t = useTranslations("footer");

  const data = [
    {
      title: t("featuredCreators.title"),
      links: navConfig.featuredCreators.map((link) => ({
        label: t(`featuredCreators.${link.key}`),
        link: link.href,
      })),
    },
    {
      title: t("watchRecordings.title"),
      links: navConfig.watchRecordings.map((link) => ({
        label: t(`watchRecordings.${link.key}`),
        link: link.href,
      })),
    },
    {
      title: t("legal.title"),
      links: navConfig.legal.map((link) => ({
        label: t(`legal.${link.key}`),
        link: link.href,
      })),
    },
    {
      title: t("company.title"),
      links: navConfig.company.map((link) => ({
        label: t(`company.${link.key}`),
        link: link.href,
      })),
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
