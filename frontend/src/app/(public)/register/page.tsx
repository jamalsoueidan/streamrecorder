"use client";

import { register } from "@/app/actions/auth";
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
import {
  IconLock,
  IconMail,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { useActionState, useState } from "react";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <Container size="xs">
      <Stack align="center" gap={24} mb={32}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #10b981)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
          }}
        >
          <IconUserPlus size={32} />
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
            Create an account
          </Title>
          <Text style={{ color: "#64748b" }}>Join us and start exploring</Text>
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
              name="username"
              type="text"
              label="Username"
              placeholder="Choose a username"
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
                },
              }}
            />

            <PasswordInput
              name="password"
              label="Password"
              placeholder="Create a password"
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
              Password must be at least 6 characters long
            </Text>

            <Checkbox
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.currentTarget.checked)}
              label={
                <Text size="sm" style={{ color: "#94a3b8" }}>
                  I agree to the{" "}
                  <Anchor
                    component={Link}
                    href="/terms"
                    style={{ color: "#a5b4fc" }}
                  >
                    Terms and Conditions
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
              {pending ? "Creating account..." : "Create account"}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Text ta="center" mt="xl" style={{ color: "#64748b" }}>
        Already have an account?{" "}
        <Anchor
          component={Link}
          href="/login"
          style={{ color: "#a5b4fc", fontWeight: 500 }}
        >
          Sign in
        </Anchor>
      </Text>
    </Container>
  );
}
