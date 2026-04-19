"use client";

import { getFacebookAuthUrl } from "@/app/actions/facebook";
import { getGoogleAuthUrl } from "@/app/actions/google";
import { getTikTokAuthUrl } from "@/app/actions/tiktok";
import { trackEvent } from "@/app/lib/analytics";
import {
  Anchor,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandTiktok,
  IconMail,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "@/app/components/link";
import { useState } from "react";

export function RegisterChoices() {
  const t = useTranslations("register");
  const [tiktokLoading, setTiktokLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  const handleTikTokSignup = async () => {
    trackEvent("signup_method", { method: "tiktok" });
    setTiktokLoading(true);
    const url = await getTikTokAuthUrl("signup");
    window.location.href = url;
  };

  const handleGoogleSignup = async () => {
    trackEvent("signup_method", { method: "google" });
    setGoogleLoading(true);
    const url = await getGoogleAuthUrl("signup");
    window.location.href = url;
  };

  const handleFacebookSignup = async () => {
    trackEvent("signup_method", { method: "facebook" });
    setFacebookLoading(true);
    const url = await getFacebookAuthUrl("signup");
    window.location.href = url;
  };

  return (
    <>
      <Container size="sm">
        <Stack align="center" gap={16} mb={48}>
          <Title
            order={1}
            ta="center"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(99, 102, 241, 0.3))",
            }}
          >
            {t("title")}
          </Title>

          <Text
            size="xl"
            ta="center"
            maw={600}
            style={{ color: "#94a3b8", lineHeight: 1.7 }}
          >
            {t("subtitle")}
          </Text>
        </Stack>
      </Container>
      <Container size="xs">
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Stack gap="md">
            <Button
              component={Link}
              href="/register/email-password"
              onClick={() => trackEvent("signup_method", { method: "email" })}
              size="lg"
              radius="md"
              variant="gradient"
              gradient={{ from: "#6366f1", to: "#10b981", deg: 135 }}
              fullWidth
              leftSection={<IconMail />}
              style={{ fontWeight: 600, height: 48 }}
            >
              {t("choices.emailPassword")}
            </Button>

            <Button
              size="lg"
              radius="md"
              fullWidth
              leftSection={<IconBrandGoogle />}
              loading={googleLoading}
              onClick={handleGoogleSignup}
              style={{
                fontWeight: 600,
                height: 48,
                background: "#ffffff",
                color: "#1f1f1f",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {t("choices.google")}
            </Button>

            <Button
              size="lg"
              radius="md"
              fullWidth
              leftSection={<IconBrandTiktok />}
              loading={tiktokLoading}
              onClick={handleTikTokSignup}
              style={{
                fontWeight: 600,
                height: 48,
                background: "#ffffff",
                color: "#1f1f1f",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {t("choices.tiktok")}
            </Button>

            <Button
              size="lg"
              radius="md"
              fullWidth
              leftSection={<IconBrandFacebook />}
              loading={facebookLoading}
              onClick={handleFacebookSignup}
              style={{
                fontWeight: 600,
                height: 48,
                background: "#ffffff",
                color: "#1f1f1f",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {t("choices.facebook")}
            </Button>

            <Text ta="center" mt="xs" style={{ color: "#64748b" }}>
              {t("login.text")}{" "}
              <Anchor
                component={Link}
                href="/login"
                style={{ color: "#a5b4fc", fontWeight: 500 }}
              >
                {t("login.link")}
              </Anchor>
            </Text>
          </Stack>
        </Paper>

        <Text
          ta="center"
          mt="xl"
          size="xs"
          maw={400}
          mx="auto"
          style={{ color: "#64748b", lineHeight: 1.6 }}
        >
          {t("terms.text")}{" "}
          <Anchor component={Link} href="/terms" style={{ color: "#a5b4fc" }}>
            {t("terms.tosLink")}
          </Anchor>{" "}
          {t("terms.and")}{" "}
          <Anchor component={Link} href="/privacy" style={{ color: "#a5b4fc" }}>
            {t("terms.privacyLink")}
          </Anchor>
        </Text>
      </Container>
    </>
  );
}
