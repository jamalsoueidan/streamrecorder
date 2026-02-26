import {
  getStreamerActivity,
  getStreamerBattles,
  getStreamerEarnings,
  getStreamerSchedule,
  getStreamerStats,
  getStreamerTopGifters,
  getStreamerTopOpponents,
} from "@/app/actions/analytics";
import { Alert, SimpleGrid, Skeleton, Stack } from "@mantine/core";
import { IconFlask } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getFollower } from "../actions/actions";
import { ProfileHeader } from "../components/profile-header";
import { BattlesList } from "./components/battles-list";
import { EarningsChart } from "./components/earnings-chart";
import { ScheduleChart } from "./components/schedule-chart";
import { StatsOverview } from "./components/stats-overview";
import { StreamActivity } from "./components/stream-activity";
import { TopGifters } from "./components/top-gifters";
import { TopOpponents } from "./components/top-opponents";

interface PageProps {
  params: Promise<{
    username: string;
    type: string;
  }>;
}

export default async function InsightsPage({ params }: PageProps) {
  const { type, username } = await params;

  if (type !== "tiktok") {
    redirect(`/protected/${type}/${username}`);
  }

  const follower = await getFollower({ username, type });

  if (!follower) {
    redirect(`/protected/${type}/${username}`);
  }

  const t = await getTranslations("protected.profileInsights");
  const decodedUsername = decodeURIComponent(username).replace("@", "");

  const statsPromise = getStreamerStats(decodedUsername);
  const earningsPromise = getStreamerEarnings(decodedUsername);
  const giftersPromise = getStreamerTopGifters(decodedUsername);
  const battlesPromise = getStreamerBattles(decodedUsername, 10, 0);
  const opponentsPromise = getStreamerTopOpponents(decodedUsername, 10, 0);
  const activityPromise = getStreamerActivity(decodedUsername);
  const schedulePromise = getStreamerSchedule(decodedUsername);

  return (
    <section>
      <ProfileHeader follower={follower} />
      <Stack gap="xl">
        <Alert icon={<IconFlask size={16} />} color="violet" variant="light">
          {t("beta")}
        </Alert>

        <Suspense fallback={<Skeleton h={120} radius="md" />}>
          <StatsOverview statsPromise={statsPromise} />
        </Suspense>

        <Suspense fallback={<Skeleton h={160} radius="md" />}>
          <ScheduleChart schedulePromise={schedulePromise} />
        </Suspense>

        <Suspense fallback={<Skeleton h={200} radius="md" />}>
          <StreamActivity username={decodedUsername} activityPromise={activityPromise} />
        </Suspense>

        <Suspense fallback={<Skeleton h={280} radius="md" />}>
          <EarningsChart earningsPromise={earningsPromise} />
        </Suspense>

        <Suspense fallback={<Skeleton h={200} radius="md" />}>
          <BattlesList username={decodedUsername} battlesPromise={battlesPromise} />
        </Suspense>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Suspense fallback={<Skeleton h={200} radius="md" />}>
            <TopGifters giftersPromise={giftersPromise} />
          </Suspense>
          <Suspense fallback={<Skeleton h={200} radius="md" />}>
            <TopOpponents opponentsPromise={opponentsPromise} />
          </Suspense>
        </SimpleGrid>
      </Stack>
    </section>
  );
}
