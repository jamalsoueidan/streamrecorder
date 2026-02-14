import { generateAvatarUrl } from "@/app/lib/avatar-url";
import api from "@/lib/api";
import {
  Alert,
  Avatar,
  Card,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconSparkles, IconTrash } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AiCreateForm } from "../components/ai-create-form";
import { AiRequestStatus } from "../components/ai-request-status";
import { AiStudioGuard } from "../components/ai-studio-guard";

interface PageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { documentId } = await params;
  const t = await getTranslations("protected.aiStudio");

  // First, try to find an existing AI request with this documentId
  const { data: existingRequestResponse } = await api.aiRequest
    .meGetAiRequests({
      filters: {
        documentId: { $eq: documentId },
      },
      populate: {
        follower: {
          populate: { avatar: true },
        },
        recording: {
          populate: {
            sources: {
              populate: { videoOriginal: true },
            },
          },
        },
        ai_tasks: true,
      },
    })
    .catch(() => ({ data: null }));

  const existingRequest = existingRequestResponse?.data?.[0];

  // If we found an AI request, show the status view
  if (existingRequest) {
    const aiRequest = existingRequest;
    const recording = aiRequest.recording;
    const follower = aiRequest.follower;
    const isRecordingDeleted = !recording;

    return (
      <Stack
        w="100%"
        h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)"
      >
        <Flex justify="space-between" align="center">
          <Stack gap={2}>
            <Flex gap="xs" align="center">
              <IconSparkles size={32} />
              <Title order={1} size="h3">
                {t("title")}
              </Title>
            </Flex>
          </Stack>
        </Flex>

        <Divider mx={{ base: "-xs", sm: "-md" }} />

        <AiStudioGuard>
          {follower && (
            <Card withBorder padding="md" mb="md">
              <Group gap="sm">
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
                    {recording?.title || t("unknownRecording")}
                  </Text>
                </Stack>
              </Group>
            </Card>
          )}

          {isRecordingDeleted && (
            <Alert
              color="gray"
              icon={<IconTrash size={20} />}
              title={t("recordingDeleted.title")}
              mb="md"
            >
              {t("recordingDeleted.message")}
            </Alert>
          )}

          <AiRequestStatus aiRequest={aiRequest} />
        </AiStudioGuard>
      </Stack>
    );
  }

  // Otherwise, try to fetch the recording to create a new AI request
  const { data: recordingResponse } = await api.recording
    .getRecordingsId({
      id: documentId,
      populate: {
        follower: {
          populate: { avatar: true },
        },
        sources: {
          populate: { videoOriginal: true },
        },
      },
    })
    .catch(() => ({ data: null }));

  const recording = recordingResponse?.data;

  if (!recording) {
    notFound();
  }

  const follower = recording.follower;

  return (
    <Stack
      w="100%"
      h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)"
    >
      <Flex justify="space-between" align="center">
        <Stack gap={2}>
          <Flex gap="xs" align="center">
            <IconSparkles size={32} />
            <Title order={1} size="h3">
              {t("title")}
            </Title>
          </Flex>
        </Stack>
      </Flex>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      <AiStudioGuard>
        {follower && (
          <Card withBorder padding="md" mb="md">
            <Group gap="sm">
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
                  {recording.title || t("unknownRecording")}
                </Text>
              </Stack>
            </Group>
          </Card>
        )}

        <AiCreateForm recording={recording} />
      </AiStudioGuard>
    </Stack>
  );
}
