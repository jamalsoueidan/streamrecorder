import { Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import {
  IconAlertTriangle,
  IconBan,
  IconCloud,
  IconCopyright,
  IconCreditCard,
  IconFileText,
  IconGavel,
  IconLock,
  IconLogout,
  IconRefresh,
  IconScale,
  IconShield,
  IconShieldCheck,
  IconUser,
  IconUserCheck,
  IconWorld,
} from "@tabler/icons-react";

export default function TermsAndConditions() {
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
            Terms & Conditions
          </Title>
          <Text size="sm" style={{ color: "#64748b" }}>
            Last updated: {lastUpdated}
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
              Introduction
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            By using LiveStreamRecorder.com and its services, you agree to be
            bound by these Terms and Conditions. Please read them carefully
            before using our platform. If you do not agree to these terms, you
            may not use the Service.
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
              <IconCloud size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              Service Description
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            LiveStreamRecorder provides a cloud-based platform that enables
            users to utilize our servers to perform recording tasks that would
            typically require local execution on their own computers.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            By handling the recording, archiving, and storage of streaming
            content remotely on our servers, users benefit from enhanced
            convenience, faster processing, and reduced reliance on personal
            hardware — without needing to install software or leave their
            devices running.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            LiveStreamRecorder is a technical service provider. We do not host,
            own, or control the content of third-party streaming platforms.
          </Text>
        </Paper>

        {/* Private Use Only */}
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
              <IconUser size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              Private Use Only
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            The services provided by LiveStreamRecorder are intended{" "}
            <Text component="span" fw={600} style={{ color: "#f1f5f9" }}>
              solely for personal, private, and non-commercial use
            </Text>
            .
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            Any commercial use of the Service is strictly prohibited without
            prior written consent from LiveStreamRecorder. By using this
            Service, you represent that you are accessing it in your capacity as
            a private individual and not for any commercial purposes.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            LiveStreamRecorder reserves the right to monitor account activity to
            ensure compliance with this policy. If violations are detected,
            appropriate actions may be taken, including account suspension or
            termination.
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
                background: "rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <IconUserCheck size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              Age Requirement
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            You must be at least{" "}
            <Text component="span" fw={600} style={{ color: "#f1f5f9" }}>
              18 years old
            </Text>{" "}
            or have reached the age of majority in your jurisdiction to use this
            platform. By creating an account, you confirm that you meet this
            requirement.
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
                background: "rgba(20, 184, 166, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#14b8a6",
              }}
            >
              <IconLock size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              Your Account
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            When registering for an account, you agree to:
          </Text>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              • Provide accurate, current, and complete information
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Maintain the confidentiality of your login credentials
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Not share your account with others
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Maintain only one account per person
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Notify us immediately of any unauthorized access
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Accept responsibility for all activity under your account
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            LiveStreamRecorder is not liable for any loss or damage arising from
            your failure to secure your account credentials.
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
                background: "rgba(249, 115, 22, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f97316",
              }}
            >
              <IconCopyright size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              Intellectual Property & Copyright
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            LiveStreamRecorder respects the intellectual property rights of
            others and expects users to do the same. We do not claim ownership
            of any content that users record or access. All rights to such
            content remain with the original creators or rights holders.
          </Text>
          <Text
            style={{ color: "#94a3b8", lineHeight: 1.7, fontWeight: 500 }}
            mb="sm"
          >
            By using LiveStreamRecorder, you acknowledge and agree that:
          </Text>
          <Stack gap={8} ml={16} mb="md">
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                You are solely responsible
              </Text>{" "}
              for obtaining all necessary rights and permissions from copyright
              owners before recording or accessing any content
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                You confirm
              </Text>{" "}
              that your use of the Service complies with applicable copyright
              laws and the terms of third-party streaming platforms
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                You will not use
              </Text>{" "}
              LiveStreamRecorder to create unauthorized copies of copyrighted
              streams or infringe upon the rights of third-party content
              creators
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                You are responsible
              </Text>{" "}
              for any legal consequences arising from the unauthorized use of
              streamed content
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                You will indemnify
              </Text>{" "}
              and hold LiveStreamRecorder harmless from any claims related to
              your use of the Service
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              •{" "}
              <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
                Any misuse
              </Text>{" "}
              may lead to termination of your access and potential legal action
              from rights holders
            </Text>
          </Stack>
          <Text style={{ color: "#64748b" }} size="sm">
            {
              "LiveStreamRecorder reserves the right to remove or disable access to any content alleged to be infringing and may terminate repeat infringers' access to the Service."
            }
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
              Prohibited Activities
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            You may not use this platform to:
          </Text>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              • Follow or record minors (anyone under 18)
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Access content that exploits, endangers, or sexualizes minors
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Infringe on intellectual property rights without authorization
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Engage in any illegal activity
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Harass, stalk, or harm others
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Use bots, scripts, or automated tools to abuse the Service
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Create multiple accounts to circumvent restrictions
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Upload malware or harmful software
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Reverse engineer or tamper with our systems
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Use the Service for any commercial purpose without authorization
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            Violations may result in immediate account termination without
            notice and may lead to legal action.
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
                background: "rgba(234, 179, 8, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#eab308",
              }}
            >
              <IconAlertTriangle size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              Content Removal & DMCA
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            We reserve the right to remove any content or terminate any account
            at our discretion. We will respond to claims of copyright
            infringement and take appropriate action as required by law,
            including removal of infringing content and termination of access
            for repeat infringers.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            If you believe content on our platform infringes your rights,
            involves a minor, or otherwise violates these terms, please contact
            us at{" "}
            <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
              contact@livestreamrecorder.com
            </Text>{" "}
            with complete details for prompt resolution.
          </Text>
          <Text style={{ color: "#64748b" }} size="sm">
            Please include: a description of the copyrighted work, the URL of
            the infringing content, your contact information, and a statement
            that you have a good faith belief that the use is not authorized.
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
                background: "rgba(139, 92, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b5cf6",
              }}
            >
              <IconWorld size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              Third-Party Platforms
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            Our services may rely on integrations with third-party streaming
            platforms (such as TikTok, Twitch, YouTube, Kick, etc.). We do not
            guarantee uninterrupted access to these platforms.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            Changes or restrictions imposed by third-party platforms (e.g., API
            changes, content removal, platform bans) may affect the availability
            or functionality of our services. LiveStreamRecorder is not
            responsible for any disruptions caused by third-party platforms.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            By using our services, you acknowledge that any interaction with
            third-party platforms is at your own risk, and you are solely
            responsible for complying with their terms and conditions.
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
              Payments & Subscriptions
            </Title>
          </Flex>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              • Paid plans are billed automatically until you cancel
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Subscriptions auto-renew unless canceled at least 24 hours
              before the next billing date
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Cancel anytime in your account settings
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • No refunds for unused subscription time
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • We may change pricing with reasonable notice to existing
              subscribers
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Failed payments may result in restricted access until resolved
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • You are responsible for any applicable taxes
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
                background: "rgba(244, 63, 94, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f43f5e",
              }}
            >
              <IconLogout size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              Termination
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            We may suspend or terminate your account at any time if you violate
            these terms, engage in prohibited activities, or fail to resolve
            payment issues.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            You can delete your account anytime in{" "}
            <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
              Settings
            </Text>
            . Cancellation takes effect at the end of the current billing cycle.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            Upon termination, access to the Service will be revoked immediately,
            and any data stored on our servers may be permanently deleted.
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
              Limitation of Liability
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            This platform is provided{" "}
            <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
              {"as-is"}
            </Text>{" "}
            and{" "}
            <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
              {"as-available"}
            </Text>{" "}
            without warranties of any kind, either express or implied. Your use
            of the Service is at your sole risk.
          </Text>
          <Text
            style={{ color: "#94a3b8", lineHeight: 1.7, fontWeight: 500 }}
            mb="sm"
          >
            LiveStreamRecorder is not liable for:
          </Text>
          <Stack gap={8} ml={16}>
            <Text style={{ color: "#94a3b8" }}>
              • Content created, recorded, or accessed by users
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Actions of third-party streaming platforms
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Service interruptions or technical issues
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Indirect, incidental, special, or consequential damages
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Loss of data, profits, or business opportunities
            </Text>
            <Text style={{ color: "#94a3b8" }}>
              • Unauthorized access due to your failure to secure credentials
            </Text>
          </Stack>
          <Text mt="md" style={{ color: "#64748b" }} size="sm">
            To the fullest extent permitted by law, our total liability shall
            not exceed the amount paid by you for the Service during the twelve
            (12) months preceding the event giving rise to the claim.
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
              Indemnification
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            You agree to defend, indemnify, and hold harmless LiveStreamRecorder
            and its affiliates, officers, agents, and employees from any claims,
            damages, losses, liabilities, costs, or expenses (including legal
            fees) arising from your use of the platform, your violation of these
            terms, or your infringement of any third-party rights.
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
              Modifications
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }} mb="md">
            LiveStreamRecorder reserves the right to modify, update, or
            discontinue any part of the Service at any time without prior
            notice. We may also update these terms at any time.
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            {
              'Continued use of the platform after changes means you accept the new terms. We will update the "Last updated" date at the top of this page when changes are made.'
            }
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
              Governing Law
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            These Terms shall be governed by and construed in accordance with
            the laws of Denmark, without regard to its conflict of law
            provisions. Any disputes arising from these terms or your use of the
            Service shall be subject to the exclusive jurisdiction of the courts
            of Denmark.
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
              <IconShield size={20} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9", fontWeight: 600 }}>
              Contact Us
            </Title>
          </Flex>
          <Text style={{ color: "#94a3b8", lineHeight: 1.7 }}>
            Questions or concerns about these terms? Contact us at{" "}
            <Text component="span" fw={500} style={{ color: "#f1f5f9" }}>
              contact@livestreamrecorder.com
            </Text>
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
            By using LiveStreamRecorder, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and Conditions.
          </Text>
        </div>
      </Stack>
    </Container>
  );
}
