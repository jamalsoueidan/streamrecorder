import { generateAvatarUrl } from "@/app/lib/avatar-url";
import api from "@/lib/api";
import {
  ActionIcon,
  Alert,
  Avatar,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiCreateForm } from "../../components/ai-create-form";
import { AiStudioGuard } from "../../components/ai-studio-guard";

const MONTHLY_QUOTA = 6;

interface PageProps {
  params: Promise<{
    recordingDocumentId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { recordingDocumentId } = await params;
  const t = await getTranslations("protected.aiStudio");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString("en", { month: "long", day: "numeric" });

  const [{ data: recordingResponse }, usageResponse] = await Promise.all([
    api.recording
      .getRecordingsId({
        id: recordingDocumentId,
        populate: {
          follower: { populate: { avatar: true } },
          sources: { populate: { videoOriginal: true } },
        },
      })
      .catch(() => ({ data: null })),
    api.aiRequest
      .meGetAiRequests({
        "pagination[pageSize]": 1,
        "pagination[page]": 1,
        "filters[createdAt][$gte]": startOfMonth,
      } as any)
      .catch(() => null),
  ]);

  const recording = recordingResponse?.data;

  if (!recording) {
    notFound();
  }

  const follower = recording.follower;
  const usedThisMonth = usageResponse?.data?.meta?.pagination?.total ?? 0;
  const limitReached = usedThisMonth >= MONTHLY_QUOTA;

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

        {limitReached ? (
          <Alert icon={<IconAlertCircle />} color="orange" variant="light" title="Monthly limit reached">
            You've used all {MONTHLY_QUOTA} AI generations for this month. Your limit resets on {resetDate}.
            If you need more, reach out to us and we'll add additional generations to your account.
          </Alert>
        ) : (
          <AiCreateForm recording={recording} />
        )}
      </AiStudioGuard>
    </Stack>
  );
}
