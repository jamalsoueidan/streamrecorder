import { usernameOrFilter } from "@/app/lib/username-filter";
import PaginationControls from "@/app/components/pagination";
import publicApi from "@/lib/public-api";
import {
  ActionIcon,
  Center,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconScissors } from "@tabler/icons-react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getFollower } from "../actions/actions";
import { ProfileHeader } from "../components/profile-header";
import { ProfileClipCard } from "./components/profile-clip-card";

interface PageProps {
  params: Promise<{
    username: string;
    type: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { type, username } = await params;
  const { page } = await searchParams;
  const t = await getTranslations("protected.profile");
  const locale = await getLocale();

  const follower = await getFollower({ username, type });

  if (!follower) {
    redirect(`/search?username=${username}&type=${type}`);
  }

  const pageNumber = parseInt(page || "1", 10);
  const limit = 6;

  const response = await publicApi.clip
    .getClips({
      filters: {
        follower: {
          ...usernameOrFilter(username),
          type: { $eq: type },
        },
      },
      populate: {
        follower: {
          populate: { avatar: true },
        },
      },
      "pagination[pageSize]": limit,
      "pagination[page]": pageNumber,
      "pagination[withCount]": true,
      sort: "createdAt:desc",
      locale,
    })
    .catch(() => null);

  const clips = response?.data?.data || [];
  const totalPages = response?.data?.meta?.pagination?.pageCount || 1;
  const clipsCount = response?.data?.meta?.pagination?.total || 0;

  return (
    <section>
      <ProfileHeader follower={follower} isRecording={false} clipsCount={clipsCount} />

      {clips.length === 0 ? (
        <Stack align="center" justify="center" py={80} gap="lg">
          <ActionIcon
            variant="transparent"
            size={120}
            radius="xl"
            color="white"
          >
            <IconScissors size={90} stroke={2} />
          </ActionIcon>
          <Stack align="center" gap={12}>
            <Title order={2} fw={600}>
              {t("noClips.title")}
            </Title>
            <Text size="xl" c="dimmed" maw={450} ta="center">
              {t("noClips.description")}
            </Text>
          </Stack>
        </Stack>
      ) : (
        <Stack gap="md">
          {totalPages > 1 && (
            <Center>
              <PaginationControls total={totalPages} size="lg" />
            </Center>
          )}
          <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
            {clips.map((clip) => (
              <ProfileClipCard
                key={clip.documentId}
                clip={clip}
                locale={locale}
              />
            ))}
          </SimpleGrid>
          {totalPages > 1 && (
            <Center>
              <PaginationControls total={totalPages} size="lg" />
            </Center>
          )}
        </Stack>
      )}
    </section>
  );
}
