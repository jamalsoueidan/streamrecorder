import { Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconAlertCircle,
  IconBan,
  IconCash,
  IconFileText,
  IconGavel,
  IconLock,
  IconPencil,
  IconShield,
  IconTrash,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";

export default function TermsAndConditions() {
  const lastUpdated = "December 25, 2025";

  return (
    <Container size="md">
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
            Terms and Conditions
          </Title>
          <Text size="sm" style={{ color: "#64748b" }}>
            Last updated: {lastUpdated}
          </Text>
        </Stack>

        {/* Intro */}
        <Text ta="center" style={{ color: "#94a3b8", lineHeight: 1.7 }}>
          By using this platform, you agree to these terms. If you do not agree,
          please do not use the service.
        </Text>

        {/* 1. Age Requirement */}
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
              <IconUserCheck size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              1. Age Requirement
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            You must be at least 18 years old to use this platform. By creating
            an account, you confirm that you are 18 or older.
          </Text>
        </Paper>

        {/* 2. Your Account */}
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
              <IconUser size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              2. Your Account
            </Title>
          </Flex>
          <Stack gap={4} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              {
                "• You are responsible for keeping your login credentials secure"
              }
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• One account per person"}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• Provide accurate information"}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• You are responsible for all activity under your account"}
            </Text>
          </Stack>
        </Paper>

        {/* 3. Your Responsibility */}
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
              <IconShield size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              3. Your Responsibility
            </Title>
          </Flex>
          <Text fw={500} mb="sm" style={{ color: "#f1f5f9", lineHeight: 1.7 }}>
            You are fully responsible for the streamers you choose to follow and
            any content associated with them.
          </Text>
          <Text size="sm" style={{ color: "#64748b", lineHeight: 1.7 }}>
            We do not pre-screen or monitor content. You must ensure that your
            use of this platform complies with all applicable laws and the terms
            of any third-party streaming platforms.
          </Text>
        </Paper>

        {/* 4. Prohibited Content */}
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
              4. Prohibited Content
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="sm">
            You may not use this platform to:
          </Text>
          <Stack gap={4} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              {"• Follow or record minors (anyone under 18)"}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {
                "• Access content that exploits, endangers, or sexualizes minors"
              }
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• Infringe on intellectual property rights"}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• Engage in any illegal activity"}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• Harass, stalk, or harm others"}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• Use bots or automated tools to abuse the service"}
            </Text>
          </Stack>
        </Paper>

        {/* 5. Content Removal & DMCA */}
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
              <IconFileText size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              5. Content Removal and DMCA
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="sm">
            We reserve the right to remove any content or terminate any account
            at our discretion.
          </Text>
          <Text size="sm" style={{ color: "#64748b", lineHeight: 1.7 }}>
            If you believe content on our platform infringes your rights or
            involves a minor, contact us and we will investigate and take
            appropriate action.
          </Text>
        </Paper>

        {/* 6. Payments & Subscriptions */}
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
              <IconCash size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              6. Payments and Subscriptions
            </Title>
          </Flex>
          <Stack gap={4} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              {"• Paid plans are billed automatically until you cancel"}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• Cancel anytime in your account settings"}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• No refunds for unused subscription time"}
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              {"• We may change pricing with notice to existing subscribers"}
            </Text>
          </Stack>
        </Paper>

        {/* 7. Termination */}
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
              <IconTrash size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              7. Termination
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            We may suspend or terminate your account at any time if you violate
            these terms. You can also delete your account anytime in Settings.
          </Text>
        </Paper>

        {/* 8. Limitation of Liability */}
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
              <IconGavel size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              8. Limitation of Liability
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="sm">
            This platform is provided as-is without warranties. We are not
            liable for:
          </Text>
          <Stack gap={4} ml={16}>
            <Text size="sm" style={{ color: "#64748b" }}>
              {"• Content created or accessed by users"}
            </Text>
            <Text size="sm" style={{ color: "#64748b" }}>
              {"• Actions of third-party streaming platforms"}
            </Text>
            <Text size="sm" style={{ color: "#64748b" }}>
              {"• Service interruptions or technical issues"}
            </Text>
            <Text size="sm" style={{ color: "#64748b" }}>
              {"• Any damages arising from your use of the platform"}
            </Text>
          </Stack>
        </Paper>

        {/* 9. Indemnification */}
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
              <IconLock size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              9. Indemnification
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            You agree to defend and hold us harmless from any claims, damages,
            or expenses arising from your use of this platform or violation of
            these terms.
          </Text>
        </Paper>

        {/* 10. Changes */}
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
              <IconPencil size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              10. Changes
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            We may update these terms. Continued use of the platform after
            changes means you accept the new terms.
          </Text>
        </Paper>

        {/* Contact Alert */}
        <Paper
          p="lg"
          radius="lg"
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          <Flex gap={12} align="center">
            <IconAlertCircle size={20} style={{ color: "#3b82f6" }} />
            <Text size="sm" style={{ color: "#94a3b8" }}>
              Questions or concerns? Contact us at{" "}
              <Text component="span" fw={600} style={{ color: "#f1f5f9" }}>
                contact@example.com
              </Text>
            </Text>
          </Flex>
        </Paper>
      </Stack>
    </Container>
  );
}
