"use client";

import { register } from "@/app/actions/auth";
import { trackEvent } from "@/app/lib/analytics";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconLock, IconMail, IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useActionState, useEffect, useState } from "react";

export function RegisterForm() {
  const t = useTranslations("register");
  const router = useRouter();
  const [state, formAction, pending] = useActionState(register, null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (state?.success) {
      trackEvent("signup");
      router.push("/discover");
    }
  }, [state, router]);

  return (
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

      <Paper
        p="xl"
        radius="lg"
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        {state?.error && (
          <Paper
            p="md"
            radius="md"
            mb="lg"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <Text size="sm" style={{ color: "#fca5a5" }}>
              {state.error}
            </Text>
          </Paper>
        )}

        <form action={formAction}>
          <Stack gap="lg">
            <TextInput
              name="username"
              type="text"
              label={t("username.label")}
              placeholder={t("username.placeholder")}
              required
              leftSection={<IconUser size={18} style={{ color: "#64748b" }} />}
              styles={{
                label: { color: "#f1f5f9", marginBottom: 8 },
                input: {
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#f1f5f9",
                  height: 48,
                },
              }}
            />

            <TextInput
              name="email"
              type="email"
              label={t("email.label")}
              placeholder={t("email.placeholder")}
              required
              leftSection={<IconMail size={18} style={{ color: "#64748b" }} />}
              styles={{
                label: { color: "#f1f5f9", marginBottom: 8 },
                input: {
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#f1f5f9",
                  height: 48,
                },
              }}
            />

            <PasswordInput
              name="password"
              label={t("password.label")}
              placeholder={t("password.placeholder")}
              required
              minLength={6}
              leftSection={<IconLock size={18} style={{ color: "#64748b" }} />}
              styles={{
                label: { color: "#f1f5f9", marginBottom: 8 },
                input: {
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#f1f5f9",
                  height: 48,
                },
                innerInput: {
                  color: "#f1f5f9",
                },
              }}
            />

            <Text size="xs" style={{ color: "#64748b" }}>
              {t("password.hint")}
            </Text>

            <Checkbox
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.currentTarget.checked)}
              label={
                <Text size="sm" style={{ color: "#94a3b8" }}>
                  {t("terms.agree")}{" "}
                  <Anchor
                    component={Link}
                    href="/terms"
                    style={{ color: "#a5b4fc" }}
                  >
                    {t("terms.link")}
                  </Anchor>
                </Text>
              }
              styles={{
                input: {
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                },
              }}
            />

            <Button
              type="submit"
              size="lg"
              radius="md"
              loading={pending}
              disabled={!acceptedTerms}
              variant="gradient"
              gradient={{ from: "#6366f1", to: "#10b981", deg: 135 }}
              fullWidth
              style={{ fontWeight: 600, height: 48 }}
            >
              {pending ? t("submit.loading") : t("submit.default")}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Text ta="center" mt="xl" style={{ color: "#64748b" }}>
        {t("login.text")}{" "}
        <Anchor
          component={Link}
          href="/login"
          style={{ color: "#a5b4fc", fontWeight: 500 }}
        >
          {t("login.link")}
        </Anchor>
      </Text>
    </Container>
  );
}
