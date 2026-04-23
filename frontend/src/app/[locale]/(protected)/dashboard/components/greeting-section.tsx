import { Flex, Stack, Text, Title } from "@mantine/core";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.livestreamrecorder.twa";

interface GreetingSectionProps {
  userPromise: Promise<{ data?: { username?: string } | null } | null>;
}

export async function GreetingSection({ userPromise }: GreetingSectionProps) {
  const t = await getTranslations("protected.dashboard");
  const userData = await userPromise;
  const username = userData?.data?.username || "";

  const hour = new Date().getHours();
  const greetingKey =
    hour < 12
      ? "greetingMorning"
      : hour < 17
        ? "greetingAfternoon"
        : "greetingEvening";

  return (
    <Flex justify="space-between" align="center" w="100%" p="xl" gap="md">
      <Stack gap={2}>
        <Flex gap="xs" align="center">
          <Title order={1} size="h1" c="white">
            {t(greetingKey, { username })}
          </Title>
        </Flex>
        <Text size="lg" c="white">
          {t("greetingSubtitle")}
        </Text>
      </Stack>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="play-store-badge"
        style={{ flexShrink: 0, display: "inline-flex" }}
      >
        <Image
          src="/google_play.png"
          alt="Get it on Google Play"
          width={180}
          height={70}
          style={{ height: "auto", width: "auto", maxWidth: 180 }}
        />
      </a>
      <style>{`
        @media (display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui) {
          .play-store-badge { display: none !important; }
        }
      `}</style>
    </Flex>
  );
}
