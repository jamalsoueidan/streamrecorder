import { getProfileUrl } from "@/app/components/open-social";
import publicApi from "@/lib/public-api";
import { ActionIcon, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { getFormatter } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import VideoEditor from "./video-editor";

interface Props {
  params: Promise<{ type: string; username: string; id: string }>;
}

export default async function EditVideoPage({ params }: Props) {
  const { id } = await params;
  const format = await getFormatter();
  const { data } = await publicApi.recording.getRecordingsId({ id }, {
    query: {
      populate: {
        sources: { fields: ["*"] },
        follower: {
          fields: ["username", "type"],
          populate: ["owner"],
        },
      },
    },
  } as never);

  const recording = data?.data;

  if (!recording) {
    notFound();
  }

  const profileUrl = getProfileUrl({
    username: recording.follower?.username,
    type: recording.follower?.type as any,
  });

  return (
    <Stack w="100%">
      <Group w="100%">
        <Stack gap={2}>
          <Group gap="xs">
            <Link href={profileUrl}>
              <ActionIcon variant="subtle" size="lg">
                <IconArrowLeft />
              </ActionIcon>
            </Link>
            <Title order={1} size="h3">
              Edit Clip{" "}
              {format.dateTime(new Date(recording.createdAt || ""), {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Title>
          </Group>
          <Text size="sm" c="dimmed">
            Trim and export a clip from{" "}
            {decodeURIComponent(recording.follower?.username || "")}
          </Text>
        </Stack>
      </Group>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      <VideoEditor recording={recording} />
    </Stack>
  );
}
