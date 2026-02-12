"use client";

import {
  Badge,
  Button,
  Container,
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
  IconBell,
  IconBrandTiktok,
  IconCheck,
  IconClock,
  IconCrown,
  IconDiamond,
  IconDownload,
  IconEye,
  IconEyeOff,
  IconGif,
  IconHeart,
  IconLanguage,
  IconMessage,
  IconMessageStar,
  IconSearch,
  IconShield,
  IconSparkles,
  IconStar,
  IconUsers,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    icon: IconEye,
    iconColor: "#94a3b8",
    iconBg: "rgba(148, 163, 184, 0.15)",
    description: "Perfect for getting started with live stream recording.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    borderColor: "rgba(255, 255, 255, 0.06)",
    background: "rgba(255, 255, 255, 0.02)",
    priceColor: "#f1f5f9",
    priceGradient: undefined,
    ctaLabel: "Get Started Free",
    ctaVariant: "outline" as const,
    ctaStyle: {
      borderColor: "rgba(255, 255, 255, 0.1)",
      color: "#94a3b8",
    },
    glow: false,
    features: [
      { icon: IconUsers, text: "Add up to 3 creators", included: true },
      { icon: IconVideo, text: "Standard recording quality", included: true },
      { icon: IconDownload, text: "Download recordings", included: false },
      { icon: IconEyeOff, text: "Delete / Hide recordings", included: false },
      {
        icon: IconBell,
        text: "Notifications when recording is ready",
        included: false,
      },
      {
        icon: IconSparkles,
        text: "AI highlights & best moments",
        included: false,
      },
      {
        icon: IconGif,
        text: "AI meme & GIF creator",
        included: false,
      },
      {
        icon: IconLanguage,
        text: "AI subtitles & translation",
        included: false,
      },
      {
        icon: IconSearch,
        text: "SEO-optimized public profile",
        included: false,
      },
      { icon: IconCrown, text: "Premium badge on profile", included: false },
      {
        icon: IconMessageStar,
        text: "Request features to develop",
        included: false,
      },
      { icon: IconStar, text: "Priority support", included: false },
      {
        icon: IconMessage,
        text: "Live chat message",
        included: false,
      },
      {
        icon: IconHeart,
        text: "Add to favorites",
        included: false,
      },
      {
        icon: IconClock,
        text: "Watch later",
        included: false,
      },
      {
        icon: IconBrandTiktok,
        text: "Post clips directly to TikTok",
        included: false,
      },
    ],
  },
  {
    name: "Champion",
    icon: IconShield,
    iconColor: "#f59e0b",
    iconBg: "rgba(245, 158, 11, 0.2)",
    description: "Full recording control and privacy.",
    monthlyPrice: 10,
    yearlyPrice: 90,
    badge: null,
    borderColor: "rgba(245, 158, 11, 0.2)",
    background:
      "linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(234, 179, 8, 0.03) 100%)",
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
    glow: false,
    features: [
      { icon: IconUsers, text: "Add up to 20 creators", included: true },
      {
        icon: IconVideo,
        text: "Best available recording quality",
        included: true,
      },
      { icon: IconDownload, text: "Download recordings", included: true },
      { icon: IconEyeOff, text: "Delete / Hide recordings", included: true },
      {
        icon: IconBell,
        text: "Notifications when recording is ready",
        included: true,
      },
      {
        icon: IconSearch,
        text: "SEO-optimized public profile",
        included: true,
      },
      {
        icon: IconHeart,
        text: "Add to favorites",
        included: true,
      },
      {
        icon: IconClock,
        text: "Watch later",
        included: true,
      },
      {
        icon: IconBrandTiktok,
        text: "Post clips directly to TikTok",
        included: true,
      },
      {
        icon: IconSparkles,
        text: "AI highlights & best moments",
        included: false,
      },
      {
        icon: IconGif,
        text: "AI meme & GIF creator",
        included: false,
      },
      {
        icon: IconLanguage,
        text: "AI subtitles & translation",
        included: false,
      },
      { icon: IconCrown, text: "Premium badge on profile", included: false },
      {
        icon: IconMessageStar,
        text: "Request features to develop",
        included: false,
      },
      { icon: IconStar, text: "Priority support", included: false },
      {
        icon: IconMessage,
        text: "Live chat message",
        included: false,
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
    badge: "Most Popular",
    borderColor: "rgba(139, 92, 246, 0.25)",
    background:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)",
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
    glow: true,
    features: [
      { icon: IconUsers, text: "Add up to 100 creators", included: true },
      {
        icon: IconVideo,
        text: "Best available recording quality",
        included: true,
      },
      { icon: IconDownload, text: "Download recordings", included: true },
      { icon: IconEyeOff, text: "Delete / Hide recordings", included: true },
      {
        icon: IconBell,
        text: "Notifications when recording is ready",
        included: true,
      },
      {
        icon: IconSearch,
        text: "SEO-optimized public profile",
        included: true,
      },
      {
        icon: IconHeart,
        text: "Add to favorites",
        included: true,
      },
      {
        icon: IconClock,
        text: "Watch later",
        included: true,
      },
      {
        icon: IconBrandTiktok,
        text: "Post clips directly to TikTok",
        included: true,
      },
      {
        icon: IconSparkles,
        text: "AI highlights & best moments",
        included: true,
      },
      {
        icon: IconGif,
        text: "AI meme & GIF creator",
        included: true,
      },
      {
        icon: IconLanguage,
        text: "AI subtitles & translation",
        included: true,
      },
      { icon: IconCrown, text: "Premium badge on profile", included: true },
      {
        icon: IconMessageStar,
        text: "Request features to develop",
        included: true,
      },
      { icon: IconStar, text: "Priority support", included: true },
      {
        icon: IconMessage,
        text: "Live chat message",
        included: true,
      },
    ],
  },
];

function FeatureRow({
  icon: Icon,
  text,
  included,
}: {
  icon: React.ElementType;
  text: string;
  included: boolean;
}) {
  return (
    <Flex gap={12} align="center">
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: included
            ? "rgba(16, 185, 129, 0.15)"
            : "rgba(100, 116, 139, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {included ? (
          <IconCheck size={14} color="#10b981" />
        ) : (
          <IconX size={14} color="#475569" />
        )}
      </div>
      <Flex gap={8} align="center">
        <Icon
          size={16}
          style={{ color: included ? "#94a3b8" : "#475569", flexShrink: 0 }}
        />
        <Text
          size="sm"
          style={{
            color: included ? "#e2e8f0" : "#475569",
            lineHeight: 1.5,
          }}
        >
          {text}
        </Text>
      </Flex>
    </Flex>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");

  return (
    <Container size="xl">
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 700,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Image
          src="/pricing.svg"
          alt="background"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>
      <Stack gap={48}>
        {/* Header */}
        <Stack align="center" gap={16} mb={8}>
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
            Pricing
          </Title>
          <Text
            size="lg"
            ta="center"
            style={{ color: "#94a3b8", maxWidth: 400 }}
          >
            Start recording for free. Upgrade for full control over your content
            and powerful AI tools.
          </Text>
        </Stack>

        {/* Billing Toggle */}
        <Flex justify="center">
          <Flex align="center" gap={12}>
            <SegmentedControl
              value={billing}
              onChange={setBilling}
              data={[
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
              ]}
              styles={{
                root: {
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 10,
                },
                label: {
                  color: "#94a3b8",
                  fontWeight: 500,
                  padding: "8px 20px",
                },
                indicator: {
                  background: "rgba(139, 92, 246, 0.2)",
                  borderRadius: 8,
                },
              }}
            />
            {billing === "yearly" && (
              <Badge
                size="sm"
                variant="light"
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  fontWeight: 700,
                }}
              >
                Save 25%
              </Badge>
            )}
          </Flex>
        </Flex>

        {/* Pricing Cards */}
        <Grid gutter={24} justify="center">
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
                          <Title
                            order={3}
                            style={{
                              color: "#f1f5f9",
                              fontWeight: 600,
                            }}
                          >
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
                      <Text size="sm" style={{ color: "#64748b" }}>
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
                        <Text style={{ color: "#64748b" }}>{period}</Text>
                      </Flex>

                      {/* Yearly savings note */}
                      {billing === "yearly" && plan.monthlyPrice > 0 && (
                        <Text
                          size="xs"
                          style={{ color: "#10b981", marginTop: 4 }}
                        >
                          Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}/year
                          vs monthly
                        </Text>
                      )}
                    </div>

                    {/* Features */}
                    <Stack gap={12}>
                      {plan.features.map((feature) => (
                        <FeatureRow key={feature.text} {...feature} />
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
        <Stack align="center" gap={16}>
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
              <Title
                order={4}
                ta="center"
                style={{ color: "#f1f5f9", fontWeight: 600 }}
              >
                Frequently Asked Questions
              </Title>

              <Stack gap={12}>
                <div>
                  <Text fw={500} style={{ color: "#e2e8f0" }} mb={4}>
                    Can I cancel anytime?
                  </Text>
                  <Text size="sm" style={{ color: "#64748b" }}>
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
                  <Text fw={500} style={{ color: "#e2e8f0" }} mb={4}>
                    What&apos;s the difference between Champion and Premium?
                  </Text>
                  <Text size="sm" style={{ color: "#64748b" }}>
                    Champion gives you full recording control — download,
                    delete, hide, and notifications. Premium adds AI-powered
                    features like highlights, subtitles, translation, request
                    features to develop and a premium badge.
                  </Text>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    paddingTop: 12,
                  }}
                >
                  <Text fw={500} style={{ color: "#e2e8f0" }} mb={4}>
                    What platforms do you support?
                  </Text>
                  <Text size="sm" style={{ color: "#64748b" }}>
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
                  <Text fw={500} style={{ color: "#e2e8f0" }} mb={4}>
                    How do AI highlights work?
                  </Text>
                  <Text size="sm" style={{ color: "#64748b" }}>
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
                  <Text fw={500} style={{ color: "#e2e8f0" }} mb={4}>
                    Do subscriptions auto-renew?
                  </Text>
                  <Text size="sm" style={{ color: "#64748b" }}>
                    Yes, all subscriptions auto-renew unless you cancel before
                    the next billing date. You can manage this in your account
                    settings at any time.
                  </Text>
                </div>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Container>
  );
}
