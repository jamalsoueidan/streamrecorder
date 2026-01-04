import {
  Badge,
  Button,
  Container,
  Flex,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCheck,
  IconCrown,
  IconDownload,
  IconHdr,
  IconPlayerPlay,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

const PLANS = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    description: "Get started with the essentials",
    featured: false,
    features: [
      { text: "Follow up to 3 creators", included: true },
      { text: "Live streaming alerts", included: true },
      { text: "Watch recordings (3 days)", included: true },
      { text: "Standard quality (480p)", included: true },
      { text: "HD and Original quality", included: false },
      { text: "Explore other creators", included: false },
      { text: "Search all creators", included: false },
      { text: "Download videos", included: false },
      { text: "Favorite videos", included: false },
      { text: "Watch later list", included: false },
    ],
    cta: "Current Plan",
    ctaVariant: "default" as const,
    disabled: true,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    description: "Unlock the full experience",
    featured: true,
    features: [
      { text: "Follow up to 100 creators", included: true },
      { text: "Live streaming alerts", included: true },
      { text: "Watch recordings (14 days)", included: true },
      { text: "Standard quality (480p)", included: true },
      { text: "HD and Original quality", included: true },
      { text: "Explore other creators", included: true },
      { text: "Search all creators", included: true },
      { text: "Download videos", included: true },
      { text: "Favorite videos", included: true },
      { text: "Watch later list", included: true },
    ],
    cta: "Upgrade Now",
    ctaVariant: "gradient" as const,
    disabled: false,
  },
];

const PREMIUM_HIGHLIGHTS = [
  {
    icon: IconUsers,
    title: "100 Creators",
    description: "Follow up to 100 of your favorite streamers",
  },
  {
    icon: IconPlayerPlay,
    title: "14 Days History",
    description: "Access recordings from the past 2 weeks",
  },
  {
    icon: IconHdr,
    title: "Best Quality",
    description: "Watch in HD or original stream quality",
  },
  {
    icon: IconDownload,
    title: "Download Videos",
    description: "Save videos offline to watch anytime",
  },
];

const COMPARISON_ROWS = [
  { feature: "Creators you can follow", basic: "3", premium: "100" },
  { feature: "Recording history", basic: "3 days", premium: "14 days" },
  { feature: "Video quality", basic: "480p", premium: "1080p+" },
  { feature: "Live alerts", basic: true, premium: true },
  { feature: "Following feed", basic: true, premium: true },
  { feature: "Explore creators", basic: false, premium: true },
  { feature: "Search creators", basic: false, premium: true },
  { feature: "Download videos", basic: false, premium: true },
  { feature: "Favorites", basic: false, premium: true },
  { feature: "Watch later", basic: false, premium: true },
];

export default function PricingPage() {
  return (
    <Container size="lg" style={{ position: "relative", zIndex: 1 }}>
      <Stack gap={48}>
        {/* Header */}
        <Stack align="center" gap={12} ta="center">
          <Title
            order={1}
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
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
            Never miss a stream again
          </Title>
          <Text
            size="lg"
            maw={500}
            style={{ color: "#94a3b8", lineHeight: 1.7 }}
          >
            Choose the plan that works for you. Upgrade anytime to unlock all
            features.
          </Text>
        </Stack>

        {/* Plan Cards */}
        <Flex
          gap={32}
          justify="center"
          align="stretch"
          direction={{ base: "column", sm: "row" }}
          wrap="wrap"
        >
          {PLANS.map((plan) => (
            <Paper
              key={plan.name}
              p="xl"
              radius="lg"
              style={{
                flex: "1 1 340px",
                maxWidth: 420,
                background: "rgba(255, 255, 255, 0.02)",
                border: plan.featured
                  ? "2px solid #8b5cf6"
                  : "1px solid rgba(255, 255, 255, 0.06)",
                position: "relative",
                overflow: "visible",
              }}
            >
              {plan.featured && (
                <Badge
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "#8b5cf6", to: "#06b6d4" }}
                  leftSection={<IconCrown size={14} />}
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  Most Popular
                </Badge>
              )}

              <Stack gap="lg">
                {/* Plan Header */}
                <Stack gap={4}>
                  <Text size="xl" fw={600} style={{ color: "#f1f5f9" }}>
                    {plan.name}
                  </Text>
                  <Text size="sm" style={{ color: "#64748b" }}>
                    {plan.description}
                  </Text>
                </Stack>

                {/* Price */}
                <Flex align="baseline" gap={4}>
                  <Text
                    style={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "#f1f5f9",
                    }}
                  >
                    {plan.price}
                  </Text>
                  {plan.period && (
                    <Text size="lg" style={{ color: "#64748b" }}>
                      {plan.period}
                    </Text>
                  )}
                </Flex>

                <div
                  style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    margin: "8px 0",
                  }}
                />

                {/* Features */}
                <Stack gap={12}>
                  {plan.features.map((feature, index) => (
                    <Flex key={index} gap={12} align="center">
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: feature.included
                            ? "rgba(20, 184, 166, 0.2)"
                            : "rgba(100, 116, 139, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: feature.included ? "#14b8a6" : "#64748b",
                          flexShrink: 0,
                        }}
                      >
                        {feature.included ? (
                          <IconCheck size={14} />
                        ) : (
                          <IconX size={14} />
                        )}
                      </div>
                      <Text
                        size="sm"
                        style={{
                          color: feature.included ? "#94a3b8" : "#64748b",
                          textDecoration: feature.included
                            ? "none"
                            : "line-through",
                        }}
                      >
                        {feature.text}
                      </Text>
                    </Flex>
                  ))}
                </Stack>

                {/* CTA */}
                <Button
                  size="lg"
                  radius="md"
                  variant={plan.ctaVariant}
                  gradient={{ from: "#8b5cf6", to: "#06b6d4" }}
                  disabled={plan.disabled}
                  fullWidth
                  style={{ fontWeight: 600 }}
                >
                  {plan.cta}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Flex>

        {/* Premium Highlights */}
        <div style={{ marginTop: 32 }}>
          <Stack align="center" gap={8} mb={32}>
            <Title order={2} style={{ color: "#f1f5f9" }}>
              Why go Premium?
            </Title>
            <Text style={{ color: "#64748b" }}>
              Everything you need to stay connected
            </Text>
          </Stack>

          <Flex gap={24} wrap="wrap" justify="center">
            {PREMIUM_HIGHLIGHTS.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <Paper
                  key={index}
                  p="lg"
                  radius="lg"
                  style={{
                    flex: "1 1 220px",
                    maxWidth: 280,
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <Stack align="center" ta="center" gap="sm">
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                      }}
                    >
                      <Icon size={28} />
                    </div>
                    <Text fw={600} style={{ color: "#f1f5f9" }}>
                      {highlight.title}
                    </Text>
                    <Text size="sm" style={{ color: "#64748b" }}>
                      {highlight.description}
                    </Text>
                  </Stack>
                </Paper>
              );
            })}
          </Flex>
        </div>

        {/* Feature Comparison Table */}
        <div style={{ marginTop: 32 }}>
          <Stack align="center" gap={8} mb={32}>
            <Title order={2} style={{ color: "#f1f5f9" }}>
              Compare Plans
            </Title>
            <Text style={{ color: "#64748b" }}>See exactly what you get</Text>
          </Stack>

          <Paper
            radius="lg"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              overflow: "hidden",
            }}
          >
            {/* Table Header */}
            <Flex
              p="md"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ flex: 2 }}>
                <Text fw={600} style={{ color: "#f1f5f9" }}>
                  Feature
                </Text>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <Text fw={600} style={{ color: "#f1f5f9" }}>
                  Basic
                </Text>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <Text fw={600} style={{ color: "#f1f5f9" }}>
                  Premium
                </Text>
              </div>
            </Flex>

            {/* Table Rows */}
            {COMPARISON_ROWS.map((row, index) => (
              <Flex
                key={index}
                p="md"
                align="center"
                style={{
                  borderTop:
                    index > 0 ? "1px solid rgba(255, 255, 255, 0.04)" : "none",
                }}
              >
                <div style={{ flex: 2 }}>
                  <Text size="sm" style={{ color: "#94a3b8" }}>
                    {row.feature}
                  </Text>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {typeof row.basic === "boolean" ? (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: row.basic
                          ? "rgba(20, 184, 166, 0.2)"
                          : "rgba(100, 116, 139, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: row.basic ? "#14b8a6" : "#64748b",
                      }}
                    >
                      {row.basic ? (
                        <IconCheck size={14} />
                      ) : (
                        <IconX size={14} />
                      )}
                    </div>
                  ) : (
                    <Text size="sm" ta="center" style={{ color: "#94a3b8" }}>
                      {row.basic}
                    </Text>
                  )}
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {typeof row.premium === "boolean" ? (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: row.premium
                          ? "rgba(20, 184, 166, 0.2)"
                          : "rgba(100, 116, 139, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: row.premium ? "#14b8a6" : "#64748b",
                      }}
                    >
                      {row.premium ? (
                        <IconCheck size={14} />
                      ) : (
                        <IconX size={14} />
                      )}
                    </div>
                  ) : (
                    <Badge
                      variant="gradient"
                      gradient={{ from: "#8b5cf6", to: "#06b6d4" }}
                    >
                      {row.premium}
                    </Badge>
                  )}
                </div>
              </Flex>
            ))}
          </Paper>
        </div>

        {/* Final CTA */}
        <Paper
          radius="lg"
          p="xl"
          mt={32}
          style={{
            background: "linear-gradient(135deg, #5b21b6 0%, #0e7490 100%)",
          }}
        >
          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            gap="lg"
            direction={{ base: "column", sm: "row" }}
          >
            <Stack gap={4} style={{ textAlign: "center" }}>
              <Title order={3} style={{ color: "#ffffff" }}>
                Ready to unlock everything?
              </Title>
              <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Join thousands of users who never miss their favorite streams.
              </Text>
            </Stack>
            <Button
              size="lg"
              radius="md"
              variant="white"
              color="dark"
              leftSection={<IconCrown size={20} />}
              style={{ fontWeight: 600 }}
            >
              Get Premium
            </Button>
          </Flex>
        </Paper>
      </Stack>
    </Container>
  );
}
