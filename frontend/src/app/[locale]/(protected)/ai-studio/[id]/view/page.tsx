import { generateAvatarUrl } from "@/app/lib/avatar-url";
import api from "@/lib/api";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Center,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { getFormatter, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MiniPlayer } from "../../../components/video/mini-player";
import { getFollower } from "../../actions/ai-actions";
import { AiRequestStatus } from "../../components/ai-request-status";
import { AiStudioGuard } from "../../components/ai-studio-guard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("protected.aiStudio");
  const format = await getFormatter();

  const { data: response } = await api.aiRequest
    .meGetAiRequests({
      filters: {
        documentId: { $eq: id },
      },
      populate: {
        recording: {
          populate: {
            follower: true,
            sources: {
              populate: { videoOriginal: true },
            },
          },
        },
        ai_tasks: true,
      },
    })
    .catch(() => ({ data: null }));

  const aiRequest = response?.data?.[0];

  if (!aiRequest) {
    notFound();
  }

  const recording = aiRequest.recording;
  const isRecordingDeleted = !recording;

  // Fetch follower with all localizations for profile display
  const followerDocumentId = recording?.follower?.documentId;
  const followerResponse = followerDocumentId
    ? await getFollower({ documentId: followerDocumentId })
    : null;
  const follower = followerResponse?.data;

  return (
    <Stack w="100%">
      <Group gap="sm">
        <Link href="/ai-studio">
          <ActionIcon variant="subtle" size="lg">
            <IconArrowLeft size={24} />
          </ActionIcon>
        </Link>
        <Title order={1} size="h3">
          {t("requestDetails")}
        </Title>
      </Group>

      <AiStudioGuard>
        {follower && (
          <Card withBorder padding="md" mb="md">
            <Flex justify="space-between" align="center">
              <Link
                href={`/${follower.type}/@${follower.username}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Group gap="sm" wrap="nowrap">
                  <Avatar size={48} radius="xl">
                    {follower.avatar?.url && (
                      <Image
                        src={generateAvatarUrl(follower.avatar.url)}
                        alt={follower.username || "Avatar"}
                        width={48}
                        height={48}
                      />
                    )}
                  </Avatar>
                  <Stack gap={2}>
                    <Text fw={500}>{follower.username}</Text>

                    <Text size="xs" c="dimmed">
                      {format.relativeTime(new Date(aiRequest.createdAt!))}
                    </Text>
                  </Stack>
                </Group>
              </Link>
              <Group gap={4}>
                {aiRequest.generateClips && (
                  <Badge variant="light" size="xs">
                    {t("options.clips")}
                  </Badge>
                )}
                {aiRequest.generateMemes && (
                  <Badge variant="light" size="xs">
                    {t("options.memes")}
                  </Badge>
                )}
                {aiRequest.generateProfile && (
                  <Badge variant="light" size="xs">
                    {t("options.profile")}
                  </Badge>
                )}
              </Group>
            </Flex>
          </Card>
        )}

        {/* Video Preview */}
        <Box maw={600} pos="relative" style={{ aspectRatio: "16/9" }} mb="md">
          {isRecordingDeleted ? (
            <Center
              h="100%"
              bg="dark.6"
              style={{ borderRadius: "var(--mantine-radius-md)" }}
            >
              <Stack align="center" gap="xs">
                <IconTrash size={32} color="var(--mantine-color-gray-6)" />
                <Text size="sm" c="dimmed">
                  {t("recordingDeleted.badge")}
                </Text>
              </Stack>
            </Center>
          ) : (
            <MiniPlayer documentId={recording?.documentId!} />
          )}
        </Box>

        <AiRequestStatus aiRequest={aiRequest} follower={follower} />
      </AiStudioGuard>
    </Stack>
  );
}
