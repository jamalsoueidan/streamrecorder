import {
  Anchor,
  Container,
  Flex,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconBan,
  IconCopyright,
  IconCreditCard,
  IconEye,
  IconFileText,
  IconGavel,
  IconLock,
  IconLogout,
  IconRefresh,
  IconScale,
  IconShield,
  IconShieldCheck,
  IconUserCheck,
  IconWorld,
  IconWriting,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { generateAlternates } from "@/app/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("terms");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/terms", locale),
  };
}

export default function TermsAndConditions() {
  const t = useTranslations("terms");
  const lastUpdated = "February 2, 2026";

  return (
    <Container size="md" style={{ position: "relative", zIndex: 1 }}>
      <Stack gap={32}>
        {/* Header */}
        <Stack align="center" gap={12} mb={24}>
          <Title
            order={1}
            ta="center"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
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
          <Text size="sm" style={{ color: "#64748b" }}>
            {t("header.lastUpdated", { date: lastUpdated })}
          </Text>
        </Stack>

        {/* Introduction */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <IconFileText size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("introduction.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("introduction.content")}
          </Text>
        </Paper>

        {/* Service Description */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(99, 102, 241, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
              }}
            >
              <IconWriting size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("serviceDescription.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("serviceDescription.content1")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("serviceDescription.content2")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("serviceDescription.content3")}
          </Text>
        </Paper>

        {/* User Content & License */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(168, 85, 247, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#a855f7",
              }}
            >
              <IconCopyright size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("userContent.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("userContent.content1")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("userContent.content2")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("userContent.content3")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("userContent.content4")}
          </Text>
        </Paper>

        {/* Content Visibility */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <IconEye size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("contentVisibility.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("contentVisibility.content1")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("contentVisibility.content2")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("contentVisibility.content3")}
          </Text>
        </Paper>

        {/* Age Requirement */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <IconUserCheck size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("ageRequirement.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("ageRequirement.content")}
          </Text>
        </Paper>

        {/* Your Account */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(6, 182, 212, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#06b6d4",
              }}
            >
              <IconLock size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("yourAccount.title")}
            </Title>
          </Flex>
          <Text
            style={{ color: "#94a3b8", lineHeight: 1.7, fontWeight: 500 }}
            mb="sm"
          >
            {t("yourAccount.intro")}
          </Text>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              • {t("yourAccount.items.accurate")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("yourAccount.items.confidential")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("yourAccount.items.noShare")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("yourAccount.items.oneAccount")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("yourAccount.items.notify")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("yourAccount.items.responsibility")}
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            {t("yourAccount.footer")}
          </Text>
        </Paper>

        {/* Intellectual Property & Copyright */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(239, 68, 68, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ef4444",
              }}
            >
              <IconShield size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("intellectualProperty.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("intellectualProperty.content1")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("intellectualProperty.content2")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("intellectualProperty.content3")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("intellectualProperty.content4")}
          </Text>
        </Paper>

        {/* Prohibited Activities */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(239, 68, 68, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ef4444",
              }}
            >
              <IconBan size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("prohibitedActivities.title")}
            </Title>
          </Flex>
          <Text
            style={{ color: "#94a3b8", lineHeight: 1.7, fontWeight: 500 }}
            mb="sm"
          >
            {t("prohibitedActivities.intro")}
          </Text>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              • {t("prohibitedActivities.items.noRights")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("prohibitedActivities.items.minors")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("prohibitedActivities.items.exploit")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("prohibitedActivities.items.illegal")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("prohibitedActivities.items.harass")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("prohibitedActivities.items.bots")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("prohibitedActivities.items.multipleAccounts")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("prohibitedActivities.items.malware")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("prohibitedActivities.items.reverseEngineer")}
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            {t("prohibitedActivities.footer")}
          </Text>
        </Paper>

        {/* Content Removal & DMCA */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(251, 146, 60, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fb923c",
              }}
            >
              <IconAlertTriangle size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("contentRemoval.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("contentRemoval.content1")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("contentRemoval.content2")}
          </Text>
          <Text style={{ color: "#64748b" }} size="sm">
            {t("contentRemoval.footer")}
          </Text>
        </Paper>

        {/* Third-Party Platforms */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <IconWorld size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("thirdPartyPlatforms.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("thirdPartyPlatforms.content1")}
          </Text>
          <Stack gap={8} mx={16} mb="md">
            <Anchor
              href="https://www.tiktok.com/legal/terms-of-service"
              target="_blank"
              style={{ color: "#60a5fa" }}
            >
              • {t("thirdPartyPlatforms.platforms.tiktok")}
            </Anchor>
            <Anchor
              href="https://www.twitch.tv/p/legal/terms-of-service"
              target="_blank"
              style={{ color: "#60a5fa" }}
            >
              • {t("thirdPartyPlatforms.platforms.twitch")}
            </Anchor>
            <Anchor
              href="https://www.youtube.com/t/terms"
              target="_blank"
              style={{ color: "#60a5fa" }}
            >
              • {t("thirdPartyPlatforms.platforms.youtube")}
            </Anchor>
            <Anchor
              href="https://kick.com/terms-of-service"
              target="_blank"
              style={{ color: "#60a5fa" }}
            >
              • {t("thirdPartyPlatforms.platforms.kick")}
            </Anchor>
            <Anchor
              href="https://policies.google.com/terms"
              target="_blank"
              style={{ color: "#60a5fa" }}
            >
              • {t("thirdPartyPlatforms.platforms.google")}
            </Anchor>
            <Anchor
              href="https://policies.google.com/privacy"
              target="_blank"
              style={{ color: "#60a5fa" }}
            >
              • {t("thirdPartyPlatforms.platforms.googlePrivacy")}
            </Anchor>
          </Stack>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("thirdPartyPlatforms.content2")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("thirdPartyPlatforms.content3")}
          </Text>
        </Paper>

        {/* Payments & Subscriptions */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <IconCreditCard size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("payments.title")}
            </Title>
          </Flex>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              • {t("payments.items.autoBill")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("payments.items.autoRenew")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("payments.items.cancelAnytime")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("payments.items.noRefunds")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("payments.items.priceChanges")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("payments.items.failedPayments")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("payments.items.taxes")}
            </Text>
          </Stack>
        </Paper>

        {/* Termination */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(239, 68, 68, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ef4444",
              }}
            >
              <IconLogout size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("termination.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("termination.content1")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("termination.content2")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("termination.content3")}
          </Text>
        </Paper>

        {/* Limitation of Liability */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(107, 114, 128, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
              }}
            >
              <IconScale size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("liability.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("liability.content")}
          </Text>
          <Text
            style={{ color: "#94a3b8", lineHeight: 1.7, fontWeight: 500 }}
            mb="sm"
          >
            {t("liability.intro")}
          </Text>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              • {t("liability.items.content")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("liability.items.thirdParty")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("liability.items.interruptions")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("liability.items.indirect")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("liability.items.lossData")}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • {t("liability.items.unauthorized")}
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            {t("liability.footer")}
          </Text>
        </Paper>

        {/* Indemnification */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(6, 182, 212, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#06b6d4",
              }}
            >
              <IconShieldCheck size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("indemnification.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("indemnification.content")}
          </Text>
        </Paper>

        {/* Modifications */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(236, 72, 153, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ec4899",
              }}
            >
              <IconRefresh size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("modifications.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("modifications.content1")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("modifications.content2")}
          </Text>
        </Paper>

        {/* Governing Law */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(251, 146, 60, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fb923c",
              }}
            >
              <IconGavel size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("governingLaw.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("governingLaw.content")}
          </Text>
        </Paper>

        {/* Contact */}
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Flex gap={12} align="center" mb="md">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <IconFileText size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("contact.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("contact.content")}
          </Text>
        </Paper>

        {/* Footer note */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: 24,
            marginTop: 16,
          }}
        >
          <Text size="sm" ta="center" style={{ color: "#64748b" }} mb="md">
            {t("footerNote")}
          </Text>
          <Text size="xs" ta="center" style={{ color: "#475569" }}>
            {t("disclaimer")}
          </Text>
        </div>
      </Stack>
    </Container>
  );
}
