import { enrichClipsWithUrls } from "@/app/lib/clip-url.server";
import { usernameOrFilter } from "@/app/lib/username-filter";
import publicApi from "@/lib/public-api";
import { Stack } from "@mantine/core";
import { getLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { getFollower } from "../../actions/actions";
import { ProfileHeader } from "../../components/profile-header";
import { ClipTheater } from "./components/clip-theater";

interface PageProps {
  params: Promise<{
    username: string;
    type: string;
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { type, username, id } = await params;
  const locale = await getLocale();

  const follower = await getFollower({ username, type });

  if (!follower) {
    redirect(`/my/search?username=${username}&type=${type}`);
  }

  // Fetch up to 50 clips from this creator so the theater has a real
  // queue to navigate through. Most creators have far fewer; if a creator
  // has more we can paginate later.
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
      },
      "pagination[pageSize]": 50,
      "pagination[page]": 1,
      sort: "createdAt:desc",
    } as never)
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

  const allClips = rawClips.length
    ? await enrichClipsWithUrls(rawClips)
    : [];

  const currentClip = allClips.find((c) => c.documentId === id);

  if (!currentClip) {
    notFound();
  }

  return (
    <Stack w="100%" gap="md">
      <ProfileHeader follower={follower} isRecording={false} />
      <ClipTheater
        clips={allClips}
        currentClipId={id}
        baseUrl={`/my/${type}/${username}/clips`}
      />
    </Stack>
  );
}
