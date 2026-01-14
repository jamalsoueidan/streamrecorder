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
            No invasive analytics, no selling data to third parties. Your
            privacy matters to us.
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
              Data Controller
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            LiveStreamRecorder.com is the data controller responsible for your
            personal data. If you have any questions about this Privacy Policy
            or our data practices, you can contact us at:
          </Text>
          <Text style={{ color: "#f1f5f9", lineHeight: 1.7 }} fw={500}>
            contact@livestreamrecorder.com
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
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Email address
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — to let you log in and recover your account
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Username
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — to identify your account
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Last login date
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — for basic account management
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Streamers you follow
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — to show you content from streamers you are interested in
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            That is it. Nothing else.
          </Text>
        </Paper>

        {/* Legal Basis for Processing (GDPR) */}
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
              Legal Basis for Processing
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            Under the GDPR, we process your personal data based on the following
            legal grounds:
          </Text>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Contract
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Processing is necessary to provide you with our services
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Consent
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — You have given consent for specific purposes (e.g., marketing
                emails)
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Legitimate Interest
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — To improve our services and prevent fraud
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
              Payment Processing
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            For paid subscriptions, we use{" "}
            <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
              Stripe
            </Text>{" "}
            as our payment processor. Stripe collects and processes your payment
            information directly. We do not store your credit card details on
            our servers.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {"Stripe's privacy policy can be found at: "}
            <Text component="span" fw={500} style={{ color: "#6366f1" }}>
              stripe.com/privacy
            </Text>
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
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                No cookies
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                No personal information
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                No cross-site tracking
              </Text>
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
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Page views
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Referrer (where you came from)
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Browser and device type
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Country (not precise location)
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            All data is anonymized and stored on our own servers in Europe.
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
              Data Retention
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            We retain your data only as long as necessary:
          </Text>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Account data
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Until you delete your account
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Recorded streams (Free plan)
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — 7 days
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Recorded streams (Premium plan)
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — 60 days
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Analytics data
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Anonymized, retained for service improvement
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
              Where Your Data Is Stored
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            Our servers are located in{" "}
            <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
              Europe
            </Text>
            . Your data is processed and stored in compliance with GDPR
            requirements. We do not transfer your personal data outside the
            European Economic Area (EEA) unless necessary for service provision
            (e.g., Stripe payment processing) and with appropriate safeguards in
            place.
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
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            We do not sell your data to anyone. We only share data with:
          </Text>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Stripe
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — For payment processing (if you subscribe)
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            We do not use third-party advertising networks or sell your personal
            information.
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
              Cookies
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            We use only{" "}
            <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
              essential cookies
            </Text>{" "}
            necessary for the website to function properly:
          </Text>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Session cookies
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — To keep you logged in
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Preference cookies
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — To remember your settings
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            We do not use tracking cookies, advertising cookies, or third-party
            analytics cookies.
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
              Your Rights (GDPR)
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            Under the GDPR, you have the following rights:
          </Text>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Right to Access
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Request a copy of your personal data
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Right to Rectification
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Correct inaccurate or incomplete data
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Right to Erasure
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Request deletion of your data
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Right to Restrict Processing
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Limit how we use your data
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Right to Data Portability
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Receive your data in a portable format
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Right to Object
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Object to processing based on legitimate interests
              </Text>
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Right to Withdraw Consent
              </Text>
              <Text component="span" style={{ color: "#64748b" }}>
                {" "}
                — Withdraw consent at any time
              </Text>
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            To exercise any of these rights, contact us at
            contact@livestreamrecorder.com
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
              {"Children's Privacy"}
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            Our Service is not intended for anyone under the age of{" "}
            <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
              18 years old
            </Text>
            . We do not knowingly collect personal information from children
            under 18.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            If you believe that a child has provided us with personal
            information, please contact us immediately at
            contact@livestreamrecorder.com, and we will take steps to delete
            such information from our systems.
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
              Data Security
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, alteration,
            disclosure, or destruction. This includes encryption, secure
            servers, and access controls. However, no method of transmission
            over the Internet is 100% secure, and we cannot guarantee absolute
            security.
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
            This action cannot be undone.
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
              Contact Us
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            If you have any questions about this Privacy Policy, your data, or
            your rights, please contact us:
          </Text>
          <Text style={{ color: "#f1f5f9", lineHeight: 1.7 }} fw={500}>
            contact@livestreamrecorder.com
          </Text>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            You also have the right to lodge a complaint with a supervisory
            authority (such as the Danish Data Protection Agency - Datatilsynet)
            if you believe your data protection rights have been violated.
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
            Continued use of the Service after changes constitutes acceptance of
            the updated policy.
          </Text>
        </div>
      </Stack>
    </Container>
  );
}
