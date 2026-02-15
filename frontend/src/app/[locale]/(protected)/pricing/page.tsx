"use client";

import {
  Badge,
  Button,
  Flex,
  Grid,
  GridCol,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCheck,
  IconCrown,
  IconDiamond,
  IconLibrary,
  IconScissors,
  IconShield,
  IconSparkles,
  IconVideo,
} from "@tabler/icons-react";
import { useState } from "react";

const PLANS = [
  {
    name: "Champion",
    icon: IconShield,
    iconColor: "#f59e0b",
    iconBg: "rgba(245, 158, 11, 0.2)",
    description: "Full recording control and privacy.",
    monthlyPrice: 10,
    yearlyPrice: 90,
    badge: null,
    borderColor: "rgba(245, 158, 11, 0.35)",
    background:
      "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(234, 179, 8, 0.06) 100%)",
    priceColor: "#f59e0b",
    priceGradient: undefined,
    ctaLabel: "Get Champion",
    ctaVariant: "filled" as const,
    ctaStyle: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      border: "none",
      fontWeight: 600,
      color: "#ffffff",
    },
    ctaDisabled: false,
    glow: false,
    featureGroups: [
      {
        title: "Recordings",
        icon: IconVideo,
        features: [
          "Up to 20 channels",
          "Best recording quality",
          "Download recordings",
          "Delete & hide recordings",
          "Notifications when ready",
        ],
      },
      {
        title: "Library",
        icon: IconLibrary,
        features: [
          "Favorites",
          "Watch later",
        ],
      },
    ],
  },
  {
    name: "Premium",
    icon: IconDiamond,
    iconColor: "#a78bfa",
    iconBg: "rgba(139, 92, 246, 0.2)",
    description: "Everything you need to grow.",
    monthlyPrice: 20,
    yearlyPrice: 180,
    badge: null,
    borderColor: "rgba(139, 92, 246, 0.35)",
    background:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)",
    priceColor: undefined,
    priceGradient: "linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)",
    ctaLabel: "Upgrade to Premium",
    ctaVariant: "filled" as const,
    ctaStyle: {
      background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
      border: "none",
      fontWeight: 600,
      color: "#ffffff",
    },
    ctaDisabled: false,
    glow: true,
    featureGroups: [
      {
        title: "Everything in Champion, plus:",
        icon: null,
        features: [],
      },
      {
        title: "AI Studio",
        icon: IconSparkles,
        features: [
          "AI highlights & clips",
          "AI memes & GIFs",
          "AI subtitles & translation",
        ],
      },
      {
        title: "Clips",
        icon: IconScissors,
        features: [
          "Publish to social media",
          "Schedule posts",
        ],
      },
      {
        title: "Exclusive",
        icon: IconCrown,
        features: [
          "Up to 100 channels",
          "Premium badge on profile",
          "Request features to develop",
          "Priority support",
        ],
      },
    ],
  },
];

function FeatureGroup({
  title,
  icon: Icon,
  features,
  color,
}: {
  title: string;
  icon: React.ElementType | null;
  features: string[];
  color: string;
}) {
  if (features.length === 0) {
    return (
      <Text size="sm" fw={600} c="gray.5">
        {title}
      </Text>
    );
  }

  return (
    <Stack gap={8}>
      <Flex gap={6} align="center">
        {Icon && <Icon size={14} color="var(--mantine-color-dimmed)" />}
        <Text size="xs" fw={600} c="dimmed" tt="uppercase">
          {title}
        </Text>
      </Flex>
      <Stack gap={6}>
        {features.map((feature) => (
          <Flex key={feature} gap={8} align="center">
            <IconCheck size={16} color={color} style={{ flexShrink: 0 }} />
            <Text size="sm" c="gray.3">
              {feature}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");

  return (
    <Stack
      gap={48}
      w="100%"
      pt="xl"
      pb={80}
      pos="relative"
      style={{
        borderRadius: "var(--mantine-radius-lg)",
        overflow: "hidden",
        background: "linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, transparent 50%)",
      }}
    >
      {/* Background SVG animation - only at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 600,
          backgroundImage: "url(/pricing.svg)",
          backgroundSize: "100% auto",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
          zIndex: 0,
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      />

      {/* Header */}
      <Stack align="center" gap={16} style={{ position: "relative", zIndex: 2 }}>
        <Title
          order={1}
          ta="center"
          c="white"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: "0.05em",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          Plans & Pricing
        </Title>
        <Text size="md" ta="center" c="gray.4" fw={500} maw={600}>
          LiveStreamRecorder is completely free to use. If you'd like to support
          the project, subscribing unlocks powerful features — and your ideas
          help shape what I build next.
        </Text>
      </Stack>

      {/* Billing Toggle */}
      <Stack align="center" gap="xs" style={{ position: "relative", zIndex: 1 }}>
        <SegmentedControl
          value={billing}
          onChange={setBilling}
          data={[
            { label: "Monthly", value: "monthly" },
            { label: "Yearly — 3 months free", value: "yearly" },
          ]}
          styles={{
            root: {
              background: "var(--mantine-color-dark-6)",
              border: "1px solid var(--mantine-color-dark-4)",
              borderRadius: 10,
            },
            label: {
              fontWeight: 500,
              padding: "8px 20px",
            },
            indicator: {
              background: "var(--mantine-color-violet-light)",
              borderRadius: 8,
            },
          }}
        />
      </Stack>

      {/* Pricing Cards */}
      <Grid gutter={24} justify="center" style={{ position: "relative", zIndex: 1 }}>
        {PLANS.map((plan) => {
          const price =
            billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const period = billing === "monthly" ? "/month" : "/year";

          return (
            <GridCol
              span={{ base: 12, md: 4 }}
              key={plan.name}
              style={{ maxWidth: 420 }}
            >
              <Paper
                p="xl"
                radius="lg"
                h="100%"
                style={{
                  background: plan.background,
                  border: `1px solid ${plan.borderColor}`,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glow effect for premium */}
                {plan.glow && (
                  <div
                    style={{
                      position: "absolute",
                      top: -80,
                      right: -80,
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                )}

                <Stack gap={24} style={{ flex: 1, position: "relative" }}>
                  {/* Plan Header */}
                  <Stack gap={8}>
                    <Flex align="center" gap={10} justify="space-between">
                      <Flex align="center" gap={10}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: plan.iconBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <plan.icon size={20} color={plan.iconColor} />
                        </div>
                        <Title order={3} fw={600}>
                          {plan.name}
                        </Title>
                      </Flex>
                      {plan.badge && (
                        <Badge
                          size="sm"
                          variant="light"
                          style={{
                            background: "rgba(139, 92, 246, 0.15)",
                            color: "#a78bfa",
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {plan.badge}
                        </Badge>
                      )}
                    </Flex>
                    <Text size="sm" c="dimmed">
                      {plan.description}
                    </Text>
                  </Stack>

                  {/* Price */}
                  <div>
                    <Flex align="baseline" gap={4}>
                      <Text
                        style={{
                          fontSize: 48,
                          fontWeight: 800,
                          lineHeight: 1,
                          ...(plan.priceGradient
                            ? {
                                background: plan.priceGradient,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }
                            : {
                                color: plan.priceColor || "#f1f5f9",
                              }),
                        }}
                      >
                        ${price}
                      </Text>
                      <Text c="dimmed">{period}</Text>
                    </Flex>

                    {/* Yearly savings note */}
                    {billing === "yearly" && plan.monthlyPrice > 0 && (
                      <Text size="xs" c="green" mt={4}>
                        3 months free compared to monthly
                      </Text>
                    )}
                  </div>

                  {/* Features */}
                  <Stack gap={16}>
                    {plan.featureGroups.map((group) => (
                      <FeatureGroup
                        key={group.title}
                        title={group.title}
                        icon={group.icon}
                        features={group.features}
                        color={plan.iconColor}
                      />
                    ))}
                  </Stack>

                  {/* CTA */}
                  <div style={{ marginTop: "auto", paddingTop: 16 }}>
                    <Button
                      fullWidth
                      size="lg"
                      radius="md"
                      variant={plan.ctaVariant}
                      style={plan.ctaStyle}
                      disabled={plan.ctaDisabled}
                    >
                      {plan.ctaLabel}
                    </Button>
                  </div>
                </Stack>
              </Paper>
            </GridCol>
          );
        })}
      </Grid>

      {/* FAQ */}
      <Stack align="center" gap={16} style={{ position: "relative", zIndex: 1 }}>
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            maxWidth: 700,
            width: "100%",
          }}
        >
          <Stack gap={16}>
            <Title order={4} ta="center" fw={600}>
              Frequently Asked Questions
            </Title>

            <Stack gap={12}>
              <div>
                <Text fw={500} mb={4}>
                  Can I cancel anytime?
                </Text>
                <Text size="sm" c="dimmed">
                  Yes. You can cancel your subscription at any time from your
                  account settings. Your features will remain active until the
                  end of your billing period.
                </Text>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  paddingTop: 12,
                }}
              >
                <Text fw={500} mb={4}>
                  What's the difference between Champion and Premium?
                </Text>
                <Text size="sm" c="dimmed">
                  Champion gives you full recording control — download, delete,
                  hide, and notifications. Premium adds AI-powered features like
                  highlights, clips, subtitles, and the ability to request new
                  features.
                </Text>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  paddingTop: 12,
                }}
              >
                <Text fw={500} mb={4}>
                  What platforms do you support?
                </Text>
                <Text size="sm" c="dimmed">
                  We support TikTok, Twitch, YouTube, Kick, AfreecaTV, and
                  Pandalive — with more platforms coming soon.
                </Text>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  paddingTop: 12,
                }}
              >
                <Text fw={500} mb={4}>
                  How do AI highlights work?
                </Text>
                <Text size="sm" c="dimmed">
                  Our AI analyzes your recorded streams and automatically
                  identifies the most engaging moments — perfect for creating
                  clips to share on social media.
                </Text>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  paddingTop: 12,
                }}
              >
                <Text fw={500} mb={4}>
                  Do subscriptions auto-renew?
                </Text>
                <Text size="sm" c="dimmed">
                  Yes, all subscriptions auto-renew unless you cancel before the
                  next billing date. You can manage this in your account settings
                  at any time.
                </Text>
              </div>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}
