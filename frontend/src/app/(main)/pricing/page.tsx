"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
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
      { text: "HD & Original quality", included: false },
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
      { text: "HD & Original quality", included: true },
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
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Stack align="center" gap="xs" ta="center">
          <Badge
            size="lg"
            variant="gradient"
            gradient={{ from: "violet", to: "cyan" }}
          >
            Pricing
          </Badge>
          <Title order={1} size="2.5rem">
            Never miss a stream again
          </Title>
          <Text size="lg" c="dimmed" maw={500}>
            Choose the plan that works for you. Upgrade anytime to unlock all
            features.
          </Text>
        </Stack>

        {/* Plan Cards */}
        <Grid gutter="xl" justify="center">
          {PLANS.map((plan) => (
            <Grid.Col key={plan.name} span={{ base: 12, sm: 6, md: 5 }}>
              <Card
                shadow={plan.featured ? "xl" : "sm"}
                padding="xl"
                radius="lg"
                withBorder
                style={(theme) => ({
                  borderColor: plan.featured
                    ? theme.colors.violet[5]
                    : undefined,
                  borderWidth: plan.featured ? 2 : 1,
                  position: "relative",
                  overflow: "visible",
                })}
              >
                {plan.featured && (
                  <Badge
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "violet", to: "cyan" }}
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
                    <Text size="xl" fw={600}>
                      {plan.name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {plan.description}
                    </Text>
                  </Stack>

                  {/* Price */}
                  <Group align="baseline" gap={4}>
                    <Text size="3rem" fw={700} lh={1}>
                      {plan.price}
                    </Text>
                    {plan.period && (
                      <Text size="lg" c="dimmed">
                        {plan.period}
                      </Text>
                    )}
                  </Group>

                  <Divider />

                  {/* Features */}
                  <List spacing="sm" center>
                    {plan.features.map((feature, index) => (
                      <List.Item
                        key={index}
                        icon={
                          <ThemeIcon
                            size={22}
                            radius="xl"
                            color={feature.included ? "teal" : "gray"}
                            variant={feature.included ? "filled" : "light"}
                          >
                            {feature.included ? (
                              <IconCheck size={14} />
                            ) : (
                              <IconX size={14} />
                            )}
                          </ThemeIcon>
                        }
                      >
                        <Text
                          size="sm"
                          c={feature.included ? undefined : "dimmed"}
                          td={feature.included ? undefined : "line-through"}
                        >
                          {feature.text}
                        </Text>
                      </List.Item>
                    ))}
                  </List>

                  {/* CTA */}
                  <Button
                    size="lg"
                    radius="md"
                    variant={plan.ctaVariant}
                    gradient={{ from: "violet", to: "cyan" }}
                    disabled={plan.disabled}
                    fullWidth
                  >
                    {plan.cta}
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Premium Highlights */}
        <Box mt="xl">
          <Stack align="center" gap="xs" mb="xl">
            <Title order={2}>Why go Premium?</Title>
            <Text c="dimmed">Everything you need to stay connected</Text>
          </Stack>

          <Grid gutter="lg">
            {PREMIUM_HIGHLIGHTS.map((highlight, index) => (
              <Grid.Col key={index} span={{ base: 12, xs: 6, md: 3 }}>
                <Card padding="lg" radius="md" withBorder h="100%">
                  <Stack align="center" ta="center" gap="sm">
                    <ThemeIcon
                      size={56}
                      radius="xl"
                      variant="gradient"
                      gradient={{ from: "violet", to: "cyan" }}
                    >
                      <highlight.icon size={28} />
                    </ThemeIcon>
                    <Text fw={600}>{highlight.title}</Text>
                    <Text size="sm" c="dimmed">
                      {highlight.description}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Box>

        {/* Feature Comparison Table */}
        <Box mt="xl">
          <Stack align="center" gap="xs" mb="xl">
            <Title order={2}>Compare Plans</Title>
            <Text c="dimmed">See exactly what you get</Text>
          </Stack>

          <Card withBorder radius="lg" p={0} style={{ overflow: "hidden" }}>
            {/* Table Header */}
            <Grid
              gutter={0}
              p="md"
              style={(theme) => ({
                backgroundColor: theme.colors.dark[6],
              })}
            >
              <Grid.Col span={6}>
                <Text fw={600}>Feature</Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text fw={600} ta="center">
                  Basic
                </Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text fw={600} ta="center">
                  Premium
                </Text>
              </Grid.Col>
            </Grid>

            {/* Table Rows */}
            {COMPARISON_ROWS.map((row, index) => (
              <Grid
                key={index}
                gutter={0}
                p="md"
                style={(theme) => ({
                  borderTop: `1px solid ${theme.colors.dark[4]}`,
                })}
              >
                <Grid.Col span={6}>
                  <Text size="sm">{row.feature}</Text>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Group justify="center">
                    {typeof row.basic === "boolean" ? (
                      row.basic ? (
                        <ThemeIcon
                          size={22}
                          radius="xl"
                          color="teal"
                          variant="filled"
                        >
                          <IconCheck size={14} />
                        </ThemeIcon>
                      ) : (
                        <ThemeIcon
                          size={22}
                          radius="xl"
                          color="gray"
                          variant="light"
                        >
                          <IconX size={14} />
                        </ThemeIcon>
                      )
                    ) : (
                      <Text size="sm" ta="center">
                        {row.basic}
                      </Text>
                    )}
                  </Group>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Group justify="center">
                    {typeof row.premium === "boolean" ? (
                      row.premium ? (
                        <ThemeIcon
                          size={22}
                          radius="xl"
                          color="teal"
                          variant="filled"
                        >
                          <IconCheck size={14} />
                        </ThemeIcon>
                      ) : (
                        <ThemeIcon
                          size={22}
                          radius="xl"
                          color="gray"
                          variant="light"
                        >
                          <IconX size={14} />
                        </ThemeIcon>
                      )
                    ) : (
                      <Badge
                        variant="gradient"
                        gradient={{ from: "violet", to: "cyan" }}
                      >
                        {row.premium}
                      </Badge>
                    )}
                  </Group>
                </Grid.Col>
              </Grid>
            ))}
          </Card>
        </Box>

        {/* Final CTA */}
        <Card
          radius="lg"
          p="xl"
          mt="xl"
          style={(theme) => ({
            background: `linear-gradient(135deg, ${theme.colors.violet[9]} 0%, ${theme.colors.cyan[9]} 100%)`,
          })}
        >
          <Group justify="space-between" align="center" wrap="wrap" gap="lg">
            <Stack gap={4}>
              <Title order={3} c="white">
                Ready to unlock everything?
              </Title>
              <Text c="white" opacity={0.9}>
                Join thousands of users who never miss their favorite streams.
              </Text>
            </Stack>
            <Button
              size="lg"
              radius="md"
              variant="white"
              color="dark"
              leftSection={<IconCrown size={20} />}
            >
              Get Premium
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}
