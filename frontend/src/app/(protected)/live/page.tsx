import InfiniteRecordings from "@/app/(protected)/_components/infinity-recordings";
import { getRecordings } from "@/app/actions/recordings";
import api from "@/lib/api";
import { SortOptions } from "@/lib/types/filtering";
import { ActionIcon, Anchor, Button, Stack, Text, Title } from "@mantine/core";
import { IconVideo, IconWorldSearch } from "@tabler/icons-react";
import deepmerge from "deepmerge";

const defaultOptions = {
  "pagination[pageSize]": 10,
  filters: {
    sources: {
      state: {
        $eq: "recording",
      },
    },
  },
  populate: {
    sources: {
      filters: {
        state: {
          $eq: "recording",
        },
      },
    },
    follower: {
      fields: ["username", "type"],
      populate: {
        avatar: {
          fields: ["url"],
        },
      },
    },
  },
};

export default async function FollowingsPage() {
  const response = await api.recording.getRecordings(
    deepmerge(
      {
        "pagination[page]": 1,
        sort: SortOptions.createdAtDesc,
      },
      defaultOptions
    )
  );

  const data = response.data?.data || [];
  const meta = response.data?.meta;

  const fetchAction = async (options: Parameters<typeof getRecordings>[0]) => {
    "use server";
    const response = await api.recording.getRecordings(
      deepmerge(options, defaultOptions)
    );

    return {
      data: response.data?.data || [],
      meta: response.data?.meta,
    };
  };

  return (
    <section>
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
