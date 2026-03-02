import { Flex, Stack, Text, Title } from "@mantine/core";
import { getTranslations } from "next-intl/server";

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
    <Flex justify="space-between" align="center" w="100%" p="xl">
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
    </Flex>
  );
}
