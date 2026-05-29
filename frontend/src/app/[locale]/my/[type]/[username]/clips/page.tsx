import PaginationControls from "@/app/components/pagination";
import { enrichClipsWithUrls } from "@/app/lib/clip-url.server";
import { usernameOrFilter } from "@/app/lib/username-filter";
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
import { ClipCard } from "@/app/[locale]/my/clips/components/clip-card";

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
    redirect(`/my/search?username=${username}&type=${type}`);
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
        ...(locale !== "en"
          ? {
              localizations: {
                fields: ["locale", "title", "description"],
                filters: { locale: { $eq: locale } },
              },
            }
          : {}),
      } as never,
      "pagination[pageSize]": limit,
      "pagination[page]": pageNumber,
      "pagination[withCount]": true,
      sort: "createdAt:desc",
    })
    .catch(() => null);

  let rawClips = response?.data?.data ?? [];

  if (locale !== "en") {
    rawClips = rawClips.map((c: any) => {
      const loc = c.localizations?.[0];
      if (loc?.title) {
        return {
          ...c,
          title: loc.title,
          description: loc.description || c.description,
        };
      }
      return c;
    });
  }

  const clips = rawClips.length ? await enrichClipsWithUrls(rawClips) : [];
  const totalPages = response?.data?.meta?.pagination?.pageCount || 1;
  const clipsCount = response?.data?.meta?.pagination?.total || 0;

  return (
    <section>
      <ProfileHeader
        follower={follower}
        isRecording={false}
        clipsCount={clipsCount}
      />

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
              <PaginationControls
                siblings={1}
                boundaries={1}
                total={totalPages}
                size="md"
              />
            </Center>
          )}
          <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
            {clips.map((clip) => (
              <ClipCard
                key={clip.documentId}
                clip={clip}
                locale={locale}
              />
            ))}
          </SimpleGrid>
          {totalPages > 1 && (
            <Center>
              <PaginationControls
                siblings={1}
                boundaries={1}
                total={totalPages}
                size="md"
              />
            </Center>
          )}
        </Stack>
      )}
    </section>
  );
}
