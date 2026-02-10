"use client";

import {
  Badge,
  Button,
  Card,
  Flex,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandGoogle,
  IconChartBar,
  IconCut,
  IconLanguage,
  IconLock,
  IconMicrophone2,
  IconSparkles,
  IconTrendingUp,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const benefits = [
  {
    icon: IconBrandGoogle,
    titleKey: "discovery.title",
    descKey: "discovery.description",
    color: "#3b82f6",
  },
  {
    icon: IconChartBar,
    titleKey: "analytics.title",
    descKey: "analytics.description",
    color: "#8b5cf6",
  },
  {
    icon: IconSparkles,
    titleKey: "highlights.title",
    descKey: "highlights.description",
    color: "#f59e0b",
  },
  {
    icon: IconCut,
    titleKey: "clips.title",
    descKey: "clips.description",
    color: "#ec4899",
  },
  {
    icon: IconLanguage,
    titleKey: "translation.title",
    descKey: "translation.description",
    color: "#10b981",
  },
  {
    icon: IconTrendingUp,
    titleKey: "rankings.title",
    descKey: "rankings.description",
    color: "#f97316",
  },
  {
    icon: IconUsers,
    titleKey: "brands.title",
    descKey: "brands.description",
    color: "#6366f1",
  },
  {
    icon: IconLock,
    titleKey: "control.title",
    descKey: "control.description",
    color: "#14b8a6",
  },
];

export function PartnerBenefits() {
  const t = useTranslations("dmca.partner");

  return (
    <Paper
      p="xl"
      radius="lg"
      style={{
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.2)",
      }}
    >
      <Stack gap="lg">
        <div>
          <Flex align="center" gap="sm" wrap="wrap">
            <Title order={2} style={{ color: "#f1f5f9", fontWeight: 700 }}>
              {t("title")}
            </Title>
            <Badge variant="gradient" gradient={{ from: "#6366f1", to: "#a855f7" }}>
              {t("badge")}
            </Badge>
          </Flex>
          <Text style={{ color: "#94a3b8" }}>{t("subtitle")}</Text>
        </div>

        <Paper
          p="md"
          radius="md"
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <Flex align="center" gap="sm">
            <IconWorld size={20} style={{ color: "#10b981" }} />
            <Text size="sm" style={{ color: "#6ee7b7" }}>
              {t("publicMessage")}
            </Text>
          </Flex>
        </Paper>

        <Stack gap="md">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={benefit.titleKey}
                padding="lg"
                radius="md"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <Flex gap="md" align="center">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      background: `${benefit.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} style={{ color: benefit.color }} />
                  </div>
                  <div>
                    <Text fw={600} size="lg" style={{ color: "#f1f5f9" }}>
                      {t(benefit.titleKey)}
                    </Text>
                    <Text size="md" style={{ color: "#94a3b8" }}>
                      {t(benefit.descKey)}
                    </Text>
                  </div>
                </Flex>
              </Card>
            );
          })}
        </Stack>

        <Stack gap="xs" align="center" mt="md">
          <Button
            component={Link}
            href="/verify-ownership?intent=partnership"
            size="lg"
            variant="gradient"
            gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
            leftSection={<IconMicrophone2 size={20} />}
            style={{ fontWeight: 600 }}
          >
            {t("cta")}
          </Button>
          <Text size="xs" style={{ color: "#64748b" }}>
            {t("ctaSubtext")}
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}
