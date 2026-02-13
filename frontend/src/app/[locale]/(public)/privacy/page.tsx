import { Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconBabyCarriage,
  IconChartBar,
  IconClock,
  IconCreditCard,
  IconDatabase,
  IconFileText,
  IconLock,
  IconMail,
  IconScale,
  IconServer,
  IconShield,
  IconTrash,
  IconUserCheck,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { generateAlternates } from "@/app/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("privacy");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/privacy", locale),
  };
}

export default function PrivacyPolicy() {
  const t = useTranslations("privacy");
  const lastUpdated = "January 13, 2026";

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

        {/* Overview */}
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
              <IconLock size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("overview.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("overview.content")}
          </Text>
        </Paper>

        {/* Data Controller */}
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
                background: "rgba(139, 92, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b5cf6",
              }}
            >
              <IconFileText size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("dataController.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("dataController.content")}
          </Text>
          <Text style={{ color: "#f1f5f9", lineHeight: 1.7 }} fw={500}>
            {t("dataController.email")}
          </Text>
        </Paper>

        {/* What We Collect */}
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
              <IconDatabase size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("whatWeCollect.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("whatWeCollect.intro")}
          </Text>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("whatWeCollect.items.email")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("whatWeCollect.items.emailDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("whatWeCollect.items.username")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("whatWeCollect.items.usernameDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("whatWeCollect.items.lastLogin")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("whatWeCollect.items.lastLoginDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("whatWeCollect.items.streamers")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("whatWeCollect.items.streamersDesc")}
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            {t("whatWeCollect.footer")}
          </Text>
        </Paper>

        {/* Legal Basis for Processing */}
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
                background: "rgba(234, 179, 8, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#eab308",
              }}
            >
              <IconScale size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("legalBasis.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("legalBasis.intro")}
          </Text>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("legalBasis.items.contract")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("legalBasis.items.contractDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("legalBasis.items.consent")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("legalBasis.items.consentDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("legalBasis.items.legitimateInterest")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("legalBasis.items.legitimateInterestDesc")}
              </Text>
            </Text>
          </Stack>
        </Paper>

        {/* Payment Processing */}
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
                background: "rgba(34, 197, 94, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22c55e",
              }}
            >
              <IconCreditCard size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("payment.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("payment.content")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("payment.stripePolicy")}
          </Text>
        </Paper>

        {/* Analytics */}
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
              <IconChartBar size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("analytics.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("analytics.intro")}
          </Text>
          <Text
            style={{ color: "#94a3b8", lineHeight: 1.7, fontWeight: 500 }}
            mb="sm"
          >
            {t("analytics.notCollect")}
          </Text>
          <Stack gap={4} mx={16} mb="md">
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("analytics.notCollectItems.cookies")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("analytics.notCollectItems.personal")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("analytics.notCollectItems.tracking")}
              </Text>
            </Text>
          </Stack>
          <Text
            style={{ color: "#94a3b8", lineHeight: 1.7, fontWeight: 500 }}
            mb="sm"
          >
            {t("analytics.collect")}
          </Text>
          <Stack gap={4} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("analytics.collectItems.pageViews")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("analytics.collectItems.referrer")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("analytics.collectItems.browser")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("analytics.collectItems.country")}
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            {t("analytics.footer")}
          </Text>
        </Paper>

        {/* Data Retention */}
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
              <IconClock size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("dataRetention.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("dataRetention.intro")}
          </Text>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("dataRetention.items.account")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("dataRetention.items.accountDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("dataRetention.items.freeStreams")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("dataRetention.items.freeStreamsDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("dataRetention.items.premiumStreams")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("dataRetention.items.premiumStreamsDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("dataRetention.items.analyticsData")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("dataRetention.items.analyticsDataDesc")}
              </Text>
            </Text>
          </Stack>
        </Paper>

        {/* Where Your Data Is Stored */}
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
              <IconServer size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("dataStorage.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("dataStorage.content")}
          </Text>
        </Paper>

        {/* Third Parties */}
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
                background: "rgba(20, 184, 166, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#14b8a6",
              }}
            >
              <IconUsers size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("thirdParties.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("thirdParties.intro")}
          </Text>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("thirdParties.items.stripe")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("thirdParties.items.stripeDesc")}
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            {t("thirdParties.footer")}
          </Text>
        </Paper>

        {/* Cookies */}
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
              <IconWorld size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("cookies.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("cookies.intro")}
          </Text>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("cookies.items.session")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("cookies.items.sessionDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("cookies.items.preference")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("cookies.items.preferenceDesc")}
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            {t("cookies.footer")}
          </Text>
        </Paper>

        {/* Your Rights (GDPR) */}
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
                background: "rgba(249, 115, 22, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f97316",
              }}
            >
              <IconUserCheck size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("rights.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("rights.intro")}
          </Text>
          <Stack gap={8} mx={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("rights.items.access")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("rights.items.accessDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("rights.items.rectification")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("rights.items.rectificationDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("rights.items.erasure")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("rights.items.erasureDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("rights.items.restrict")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("rights.items.restrictDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("rights.items.portability")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("rights.items.portabilityDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("rights.items.object")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("rights.items.objectDesc")}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {t("rights.items.withdraw")}
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — {t("rights.items.withdrawDesc")}
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            {t("rights.footer")}
          </Text>
        </Paper>

        {/* Children's Privacy */}
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
              <IconBabyCarriage size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("children.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("children.content")}
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("children.contact")}
          </Text>
        </Paper>

        {/* Data Security */}
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
              <IconShield size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("security.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("security.content")}
          </Text>
        </Paper>

        {/* Delete Your Account */}
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
              <IconTrash size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("deleteAccount.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {t("deleteAccount.content")}
          </Text>
          <Text mt="xs" style={{ color: "#64748b" }} size="sm">
            {t("deleteAccount.footer")}
          </Text>
        </Paper>

        {/* Contact Us */}
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
              <IconMail size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              {t("contact.title")}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            {t("contact.content")}
          </Text>
          <Text style={{ color: "#f1f5f9", lineHeight: 1.7 }} fw={500}>
            {t("contact.email")}
          </Text>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            {t("contact.footer")}
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
          <Text size="sm" ta="center" style={{ color: "#64748b" }}>
            {t("footerNote")}
          </Text>
        </div>
      </Stack>
    </Container>
  );
}
