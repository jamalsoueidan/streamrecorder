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
    <Flex
      justify="space-between"
      align="center"
      w="100%"
      p={{ base: "md", sm: "xl" }}
      gap="sm"
      wrap="nowrap"
    >
      <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
        <Flex gap="xs" align="center">
          <Title order={1} size="h2" c="white" lineClamp={2}>
            {t(greetingKey, { username })}
          </Title>
        </Flex>
        <Text size="md" c="white" lineClamp={2}>
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
          width={140}
          height={54}
          className="play-store-badge-img"
          style={{ height: "auto", width: "100%", maxWidth: 140 }}
        />
      </a>
      <style>{`
        @media (max-width: 480px) {
          .play-store-badge-img { max-width: 110px !important; }
        }
        @media (display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui) {
          .play-store-badge { display: none !important; }
        }
      `}</style>
    </Flex>
  );
}
