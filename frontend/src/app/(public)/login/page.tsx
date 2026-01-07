"use client";

import { login } from "@/app/actions/auth";
import {
  Anchor,
  Button,
  Container,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconLock, IconMail, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <Container size="xs">
      <Stack align="center" gap={24} mb={32}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
          }}
        >
          <IconSparkles size={32} />
        </div>
        <Stack align="center" gap={8}>
          <Title
            order={1}
            ta="center"
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1.3,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome back
          </Title>
          <Text style={{ color: "#64748b" }}>
            Sign in to continue to your account
          </Text>
        </Stack>
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
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              required
              leftSection={<IconMail size={18} style={{ color: "#64748b" }} />}
              styles={{
                label: { color: "#f1f5f9", marginBottom: 8 },
                input: {
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#f1f5f9",
                  height: 48,
                  "&::placeholder": {
                    color: "#64748b",
                  },
                },
              }}
            />

            <PasswordInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              required
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
                  "&::placeholder": {
                    color: "#64748b",
                  },
                },
              }}
            />

            <Flex justify="flex-end">
              <Anchor
                component={Link}
                href="/forgot-password"
                size="sm"
                style={{ color: "#a5b4fc" }}
              >
                Forgot password?
              </Anchor>
            </Flex>

            <Button
              type="submit"
              size="lg"
              radius="md"
              loading={pending}
              variant="gradient"
              gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
              fullWidth
              style={{ fontWeight: 600, height: 48 }}
            >
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Text ta="center" mt="xl" style={{ color: "#64748b" }}>
        Do not have an account?{" "}
        <Anchor
          component={Link}
          href="/register"
          style={{ color: "#a5b4fc", fontWeight: 500 }}
        >
          Create one
        </Anchor>
      </Text>
    </Container>
  );
}
