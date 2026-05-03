import api from "@/lib/api";
import { Divider, Flex, Stack, Text, Title } from "@mantine/core";
import { IconBrandYoutube } from "@tabler/icons-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { YouTubePublishForm } from "./publish-form";

interface PageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default async function YouTubePublishPage({ params }: PageProps) {
  const { documentId } = await params;
  const t = await getTranslations("protected.myClips.youtubePublishPage");

  const clipResponse = await api.clip.meGetClipOne(
    {
      id: documentId,
    },
    {
      query: {
        locale: await getLocale(),
      },
    } as never,
  );

  const clip = clipResponse.data?.data;

  if (!clip) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const videoUrl = `${baseUrl}/clip/${documentId}/clip.mp4`;

  return (
    <Stack>
      <Flex justify="space-between" align="center">
        <Stack gap={2}>
          <Flex gap="xs" align="center">
            <IconBrandYoutube size={32} color="red" />
            <Title order={1} size="h3">
              {t("title")}
            </Title>
          </Flex>
          <Text size="sm" c="dimmed">
            {t("description")}
          </Text>
        </Stack>
      </Flex>

      <Divider mx={{ base: "-xs", sm: "-md" }} />

      <YouTubePublishForm clip={clip} videoUrl={videoUrl} />
    </Stack>
  );
}
