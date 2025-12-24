import { getRecordings } from "@/app/actions/recordings";
import dayjs from "@/app/lib/dayjs";
import api from "@/lib/api";
import { SortOptions } from "@/lib/types/filtering";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconVideo, IconWorldSearch } from "@tabler/icons-react";
import { CountryFlag } from "../../_components/country-flag";
import FollowButton from "../../_components/follow-button";
import UnfollowButton from "../../_components/unfollow-button";
import InfiniteRecordings from "../../recordings/_components/infinity-recordings";

interface PageProps {
  params: Promise<{
    username: string;
    type: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { type, username } = await params;
  const user =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles();
  const response = await api.follower.getFollowers({
    filters: {
      username,
      type,
    },
  });

  const follower = response.data.data?.at(0);

  if (!follower) {
    return <>Not found</>;
  }

  const { data, meta } = await getRecordings({
    filters: {
      follower: {
        documentId: {
          $eq: follower?.documentId,
        },
      },
    },
    "pagination[page]": 1,
    sort: SortOptions.createdAtDesc,
  });

  const resIsFollowing = await api.follower.getFollowers({
    filters: {
      documentId: {
        $eq: follower.documentId,
      },
      users: {
        id: {
          $eq: user.data.id,
        },
      },
    },
    "pagination[limit]": 0,
    "pagination[withCount]": true,
  });

  const isFollowing = resIsFollowing.data?.meta?.pagination?.total || false;

  const fetchAction = async (options: Parameters<typeof getRecordings>[0]) => {
    "use server";
    delete options.scope; //remove scope, incase user does not follow streamer
    return await getRecordings({
      ...options,
      filters: {
        follower: {
          documentId: {
            $eq: follower?.documentId,
          },
        },
      },
    });
  };

  return (
    <section>
      <Group mb="xl">
        <Avatar
          size={150}
          src={
            data?.at(0)?.sources?.at(0)?.path
              ? process.env.NEXT_PUBLIC_S3_URL! +
                data?.at(0)?.sources?.at(0)?.path +
                "preview.jpg"
              : null
          }
          styles={{
            image: {
              transform: "scale(2)",
              objectFit: "cover",
            },
          }}
        />

        <Stack gap="xs">
          <Group>
            <Title order={2}>{follower.username}</Title>
            {follower.country ? (
              <CountryFlag country={follower?.country} size={40} />
            ) : null}
          </Group>
          {isFollowing ? (
            <>
              <UnfollowButton documentId={follower.documentId!} />
            </>
          ) : (
            <FollowButton username={follower.username!} type={follower.type} />
          )}
          <div>
            <Text> recordings</Text>
            <Text size="sm">added {dayjs(follower.createdAt).fromNow()}</Text>
          </div>
        </Stack>
      </Group>

      {data.length === 0 ? (
        <Stack align="center" justify="center" py={80} gap="lg">
          <ActionIcon
            variant="transparent"
            size={120}
            radius="xl"
            color="white"
          >
            <IconVideo size={90} stroke={2} />
          </ActionIcon>
          <Stack align="center" gap={12}>
            <Title order={2} fw={600}>
              No recordings yet
            </Title>
            <Text size="xl" c="dimmed" maw={450} ta="center">
              Follow streamers to see their recordings here
            </Text>
          </Stack>
          <Anchor href="/discover" underline="never">
            <Button
              size="lg"
              radius="md"
              leftSection={<IconWorldSearch size={20} />}
            >
              Discover Streamers
            </Button>
          </Anchor>
        </Stack>
      ) : (
        <InfiniteRecordings
          initialData={data}
          initialPagination={meta}
          initialSort={SortOptions.createdAtDesc}
          fetchAction={fetchAction}
        />
      )}
    </section>
  );
}
