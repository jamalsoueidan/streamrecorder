import api from "@/lib/api";
import { Divider, Flex, Stack, Text, Title } from "@mantine/core";
import { IconBrandTiktok } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PublishForm } from "./publish-form";

interface PageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default async function PublishPage({ params }: PageProps) {
  const { documentId } = await params;
  const t = await getTranslations("protected.myClips.publishPage");

  // Fetch clip data
  const clipResponse = await api.clip.meGetClipOne({
    id: documentId,
  });

  const clip = clipResponse.data?.data;

  if (!clip) {
    notFound();
  }

  // Build video URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const videoUrl = `${baseUrl}/clip/${documentId}/clip.mp4`;

  return (
    <Stack>
      <Flex justify="space-between" align="center">
        <Stack gap={2}>
          <Flex gap="xs" align="center">
            <IconBrandTiktok size={32} />
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

      <PublishForm clip={clip} videoUrl={videoUrl} />
    </Stack>
  );
}
