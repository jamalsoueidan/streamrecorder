import { generateAvatarUrl } from "@/app/lib/avatar-url";
import api from "@/lib/api";
import {
  ActionIcon,
  Avatar,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiCreateForm } from "../../components/ai-create-form";
import { AiStudioGuard } from "../../components/ai-studio-guard";

interface PageProps {
  params: Promise<{
    recordingDocumentId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { recordingDocumentId } = await params;
  const t = await getTranslations("protected.aiStudio");

  const { data: recordingResponse } = await api.recording
    .getRecordingsId({
      id: recordingDocumentId,
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
    <Stack w="100%">
      <Group gap="sm">
        <Link href="/ai-studio">
          <ActionIcon variant="subtle" size="lg">
            <IconArrowLeft size={24} />
          </ActionIcon>
        </Link>
        <Title order={1} size="h3">
          {t("createRequest")}
        </Title>
      </Group>

      <AiStudioGuard>
        {follower && (
          <Card withBorder padding="md" mb="md">
            <Link
              href={`/${follower.type}/@${follower.username}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Group gap="sm">
                <Avatar size="md" radius="100%">
                  {follower.avatar?.url && (
                    <Image
                      src={generateAvatarUrl(follower.avatar.url)}
                      alt={follower.username || "Avatar"}
                      width={36}
                      height={36}
                    />
                  )}
                </Avatar>
                <Stack gap={2}>
                  <Text fw={500} size="xl">
                    {follower.username}
                  </Text>
                </Stack>
              </Group>
            </Link>
          </Card>
        )}

        <AiCreateForm recording={recording} />
      </AiStudioGuard>
    </Stack>
  );
}
