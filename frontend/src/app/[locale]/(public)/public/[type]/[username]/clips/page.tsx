import { IconVideo } from "@tabler/icons-react";

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { CountryFlag } from "@/app/[locale]/(protected)/components/country-flag";
import { FollowerTypeIcon } from "@/app/[locale]/(protected)/components/follower-type-icon";
import { getProfileUrl, getSocialUrl } from "@/app/components/open-social";
import { generateAvatarUrl } from "@/app/lib/avatar-url";

import { generateProfileUrl } from "@/app/lib/profile-url";
import { generateAlternates } from "@/app/lib/seo";
import publicApi from "@/lib/public-api";
import { Metadata } from "next";
import Image from "next/image";

import PaginationControls from "@/app/components/pagination";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getFollower } from "../actions/actions";
import { ImageClipPreview } from "../components/image-clip-preview";

interface PageProps {
  params: Promise<{
    username: string;
    type: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; type: string }>;
}): Promise<Metadata> {
  const { type, username } = await params;
  const t = await getTranslations("profile");
  const locale = await getLocale();
  const follower = await getFollower({ username, type, locale });

  if (!follower) {
    return {
      title: t("meta.notFoundTitle"),
      description: t("meta.notFoundDescription"),
    };
  }

  const platformName = type.charAt(0).toUpperCase() + type.slice(1);
  const translation = {
    nickname: follower.nickname || "",
    username: follower.username,
    platform: platformName,
  };
  const title = t("meta.title", translation);
  const description = follower.tagline || t("meta.description", translation);

  return {
    title,
    description,
    keywords: t("meta.keywords", translation).split(", "),
    openGraph: {
      title: t("meta.ogTitle", translation),
      description,
      type: "profile",
      siteName: "Live Stream Recorder",
      images: [
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/og/${generateProfileUrl(
          follower,
          false,
        )}`,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.twitterTitle", translation),
      description,
      images: [
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/og/${generateProfileUrl(
          follower,
          false,
        )}`,
      ],
    },
    alternates: generateAlternates(`/${type}/${follower.username}/clips`, locale),
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { type, username } = await params;
  const { page } = await searchParams;
  const t = await getTranslations("profile");
  const format = await getFormatter();
  const locale = await getLocale();
  const follower = await getFollower({ username, type, locale });

  if (!follower) {
    return notFound();
  }

  const {
    data: { data: clips, meta },
  } = await publicApi.clip.getClips({
    filters: {
      follower: {
        documentId: follower.documentId,
      },
    },
    populate: {
      follower: {
        populate: { avatar: true },
      },
    },
    locale,
    "pagination[pageSize]": 10,
    "pagination[page]": parseInt(page || "1", 10),
  });

  const totalPages = meta?.pagination?.pageCount || 1;

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const getCountryName = (countryCode?: string) => {
    if (!countryCode || countryCode === "-") return undefined;
    return regionNames.of(countryCode.toUpperCase());
  };

  const countryName = getCountryName(follower.countryCode);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const profileUrl = generateProfileUrl(follower, true);
  const platformName = type.charAt(0).toUpperCase() + type.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": baseUrl,
              name: "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${baseUrl}/creators/${type}`,
              name: `${platformName} Creators`,
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@id": profileUrl,
              name: follower.nickname || `@${follower.username}`,
            },
          },
          {
            "@type": "ListItem",
            position: 4,
            item: {
              "@id": `${profileUrl}/clips`,
              name: "Clips",
            },
          },
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${profileUrl}/clips`,
        url: `${profileUrl}/clips`,
        mainEntity: {
          "@type": "Person",
          "@id": `${profileUrl}#person`,
          name: follower.username,
          alternateName: [follower.nickname, `@${follower.username}`].filter(Boolean),
          description: follower.tagline || follower.description,
          image: generateAvatarUrl(follower.avatar?.url, true),
          url: profileUrl,
          ...(countryName && {
            nationality: {
              "@type": "Country",
              name: countryName,
            },
          }),
          sameAs: [getSocialUrl(follower)],
        },
        hasPart: clips?.length ? {
          "@type": "ItemList",
          itemListElement: clips.map((video, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${profileUrl}/clips/${video.documentId}`,
          })),
        } : undefined,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="lg">
        <Stack gap="xl">
          <Flex gap="md">
            <Avatar
              size="xl"
              radius="xl"
              styles={{
                root: {
                  overflow: "hidden",
                },
              }}
            >
              {follower.avatar?.url && (
                <Image
                  src={generateAvatarUrl(follower.avatar?.url)}
                  alt={follower.nickname || follower.username}
                  width={72}
                  height={72}
                />
              )}
            </Avatar>

            <Stack gap="0">
              <Group>
                <Title>{follower.nickname}</Title>
                <Tooltip label={follower.type}>
                  <FollowerTypeIcon
                    color="transparent"
                    type={follower.type}
                    size={30}
                  />
                </Tooltip>
                {follower.countryCode && (
                  <CountryFlag countryCode={follower.countryCode} size={30} />
                )}
              </Group>
              <Text>
                {follower.tagline ||
                  t("defaultTagline", { nickname: follower.nickname || "" })}
              </Text>
            </Stack>
          </Flex>

          <Group>
            <Link href={getProfileUrl(follower)}>
              <Button>Recordings</Button>
            </Link>
            <Link href={`${getProfileUrl(follower)}/clips`}>
              <Button>Clips</Button>
            </Link>
            <Link href={`${getProfileUrl(follower)}/memes`}>
              <Button>Memes</Button>
            </Link>
          </Group>

          {!clips || clips.length === 0 ? (
            <EmptyState />
          ) : (
            <Stack gap="xl">
              {totalPages > 1 && (
                <Center>
                  <PaginationControls total={totalPages} size="lg" />
                </Center>
              )}
              {clips?.map((clip) => (
                <Card key={clip.documentId} radius="md">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    <ImageClipPreview clip={clip} type={follower.type} />
                    <Stack>
                      <Badge size="xl">{clip.viral_score}/100</Badge>
                      <Title order={2}>{clip.title}</Title>

                      <Paper p="md" withBorder>
                        <Text size="md" c="dimmed" fw={500}>
                          {clip.description}
                        </Text>
                      </Paper>
                      <Text size="xs" suppressHydrationWarning>
                        {t("recorded", {
                          date: format.dateTime(
                            new Date(clip.createdAt || ""),
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          ),
                        })}
                      </Text>
                    </Stack>
                  </SimpleGrid>
                </Card>
              ))}
              {totalPages > 1 && (
                <Center>
                  <PaginationControls total={totalPages} size="lg" />
                </Center>
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
}

async function EmptyState() {
  const t = await getTranslations("profile");

  return (
    <Stack align="center" justify="center" py={80} gap="lg">
      <ActionIcon variant="transparent" size={120} radius="xl" color="white">
        <IconVideo size={90} stroke={2} />
      </ActionIcon>
      <Stack align="center" gap={12}>
        <Title order={2} fw={600}>
          {t("emptyState.title")}
        </Title>
        <Text size="xl" c="dimmed" maw={450} ta="center">
          {t("emptyState.description")}
        </Text>
      </Stack>
    </Stack>
  );
}
