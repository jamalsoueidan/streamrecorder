import { generateAlternates } from "@/app/lib/seo";
import { Container, Stack, Text, Title, Flex } from "@mantine/core";
import { IconShieldCheck } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { VerificationFlow } from "./components/verification-flow";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ intent?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "verifyOwnership" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/verify-ownership", locale),
  };
}

export default async function VerifyOwnershipPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "verifyOwnership" });
  const resolvedSearchParams = await searchParams;
  const intent = resolvedSearchParams.intent || "partnership";

  return (
    <Container size="sm" style={{ position: "relative", zIndex: 1 }}>
      <Stack gap={32}>
        <Stack align="center" gap={12} mb={24}>
          <Flex gap={12} align="center" justify="center">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <IconShieldCheck size={24} />
            </div>
            <Title
              order={1}
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                fontWeight: 800,
                lineHeight: 1.3,
                letterSpacing: "-0.03em",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                paddingBottom: "0.1em",
              }}
            >
              {t("header.title")}
            </Title>
          </Flex>
          <Text size="sm" style={{ color: "#64748b" }} ta="center">
            {t("header.subtitle")}
          </Text>
        </Stack>

        <VerificationFlow intent={intent} />
      </Stack>
    </Container>
  );
}
