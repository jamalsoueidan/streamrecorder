import { Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconChartBar,
  IconDatabase,
  IconLock,
  IconServer,
  IconTrash,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </Title>
          <Text size="sm" style={{ color: "#64748b" }}>
            Last updated: {lastUpdated}
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
              Overview
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            We keep things simple. We collect minimal data and do not track you.
            No analytics, no selling data to third parties.
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
              What We Collect
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            When you create an account, we store:
          </Text>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Email address
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" — to let you log in and recover your account"}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Username
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" — to identify your account"}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Last login date
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" — for basic account management"}
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Streamers you follow
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" — to show you content from streamers you are interested in"}
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            That is it. Nothing else.
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
              Analytics
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            We use Umami, a privacy-focused analytics tool, to understand how
            our site is used. This helps us improve the experience.
          </Text>
          <Text
            style={{ color: "#94a3b8", lineHeight: 1.7, fontWeight: 500 }}
            mb="sm"
          >
            What Umami does NOT collect:
          </Text>
          <Stack gap={4} ml={16} mb="md">
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                No cookies
              </Text>{" "}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                No personal information
              </Text>{" "}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                No cross-site tracking
              </Text>{" "}
            </Text>
          </Stack>
          <Text
            style={{ color: "#94a3b8", lineHeight: 1.7, fontWeight: 500 }}
            mb="sm"
          >
            What we do collect:
          </Text>
          <Stack gap={4} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {" "}
                Page views
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {" "}
                Referrer (where you came from)
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {" "}
                Browser and device type
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                {" "}
                Country (not precise location)
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            All data is anonymized and stored on our own servers in Europe.
          </Text>
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
              Where Your Data Is Stored
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            Our servers are located in Europe.
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
              Third Parties
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            We do not share your data with anyone.
          </Text>
        </Paper>

        {/* Your Rights */}
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
              Your Rights
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            You have the right to:
          </Text>
          <Stack gap={4} mt="sm" ml={16}>
            <Text style={{ color: "#94a3b8" }}>{"• Access your data"}</Text>
            <Text style={{ color: "#94a3b8" }}>{"• Correct your data"}</Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• Delete your account and all associated data at any time"}
            </Text>
          </Stack>
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
              Delete Your Account
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            To delete your account, go to{" "}
            <Text component="span" fw={600} style={{ color: "#f1f5f9" }}>
              Settings
            </Text>
            {" then "}
            <Text component="span" fw={600} style={{ color: "#f1f5f9" }}>
              Delete Account
            </Text>
            .
          </Text>
          <Text mt="xs" style={{ color: "#64748b" }} size="sm">
            Once deleted, all your data is permanently removed from our servers.
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
            If we update this policy, we will post changes here with a new date.
          </Text>
        </div>
      </Stack>
    </Container>
  );
}
