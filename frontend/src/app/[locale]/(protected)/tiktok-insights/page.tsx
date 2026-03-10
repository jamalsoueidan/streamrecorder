import {
  Divider,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import {
  getAvailableCountries,
  getAvailableLanguages,
  getGlobalBattleStats,
  getGlobalCountryLeaderboard,
  getGlobalGifterRelationships,
  getGlobalLanguageLeaderboard,
  getGlobalMostLive,
  getGlobalStats,
  getGlobalTopEarners,
  getGlobalTopGifters,
} from "./actions";
import { BattleStats } from "./components/battle-stats";
import { CountryLeaderboard } from "./components/country-leaderboard";
import { GifterRelationships } from "./components/gifter-relationships";
import { GlobalStatsWidget } from "./components/global-stats";
import { GlobalTopGifters } from "./components/global-top-gifters";
import { LanguageLeaderboard } from "./components/language-leaderboard";
import { MostLive } from "./components/most-live";
import { TopEarners } from "./components/top-earners";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function TikTokInsightsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "protected.tiktokInsights" });

  const statsPromise = getGlobalStats();
  const countriesPromise = getAvailableCountries();
  const languagesPromise = getAvailableLanguages();
  const countryLeaderboardPromise = getGlobalCountryLeaderboard();
  const languageLeaderboardPromise = getGlobalLanguageLeaderboard();
  const topEarnersPromise = getGlobalTopEarners(10, 0);
  const mostLivePromise = getGlobalMostLive(10, 0);
  const topGiftersPromise = getGlobalTopGifters(10, 0);
  const battleStatsPromise = getGlobalBattleStats(10, 0);
  const gifterRelationshipsPromise = getGlobalGifterRelationships(10, 0);

  return (
    <section>
      <Stack mb="md" gap="xs">
        <Group gap="xs">
          <IconChartBar size={32} color="#22d3ee" />
          <Title order={1} size="h3">
            {t("title")}
          </Title>
        </Group>
        <Text size="sm" c="dimmed">
          {t("description")}
        </Text>
      </Stack>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      <Stack gap="md" mt="md">
        <Suspense fallback={<Skeleton h={120} radius="md" />}>
          <GlobalStatsWidget statsPromise={statsPromise} />
        </Suspense>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Suspense fallback={<Skeleton h={360} radius="md" />}>
            <TopEarners
              initialPromise={topEarnersPromise}
              countriesPromise={countriesPromise}
              languagesPromise={languagesPromise}
            />
          </Suspense>
          <Suspense fallback={<Skeleton h={360} radius="md" />}>
            <MostLive
              initialPromise={mostLivePromise}
              countriesPromise={countriesPromise}
              languagesPromise={languagesPromise}
            />
          </Suspense>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Suspense fallback={<Skeleton h={400} radius="md" />}>
            <CountryLeaderboard dataPromise={countryLeaderboardPromise} />
          </Suspense>
          <Suspense fallback={<Skeleton h={400} radius="md" />}>
            <LanguageLeaderboard dataPromise={languageLeaderboardPromise} />
          </Suspense>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Suspense fallback={<Skeleton h={360} radius="md" />}>
            <GlobalTopGifters initialPromise={topGiftersPromise} />
          </Suspense>
          <Suspense fallback={<Skeleton h={360} radius="md" />}>
            <BattleStats initialPromise={battleStatsPromise} />
          </Suspense>
        </SimpleGrid>

        <Suspense fallback={<Skeleton h={360} radius="md" />}>
          <GifterRelationships initialPromise={gifterRelationshipsPromise} />
        </Suspense>
      </Stack>
    </section>
  );
}
