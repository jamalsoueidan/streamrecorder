"use client";

import { submitContact } from "@/app/actions/messages";
import {
  Button,
  Flex,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Submitted } from "./submitted";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid =
    formData.name.trim() && formData.email.trim() && formData.message.trim();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError(null);
    setLoading(true);

    const result = await submitContact(formData);

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong");
    }
  };

  if (submitted) {
    return <Submitted />;
  }

  return (
    <Paper
      p="xl"
      radius="lg"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <Title order={3} mb="md" style={{ color: "#f1f5f9", fontWeight: 600 }}>
        {t("title")}
      </Title>
      <Text style={{ color: "#64748b" }} mb="lg">
        {t("description")}
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          {error && (
            <Paper
              p="md"
              radius="md"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <Flex gap={8} align="center">
                <IconAlertCircle size={18} style={{ color: "#ef4444" }} />
                <Text size="sm" style={{ color: "#fca5a5" }}>
                  {error}
                </Text>
              </Flex>
            </Paper>
          )}

          <TextInput
            label={t("name.label")}
            placeholder={t("name.placeholder")}
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            styles={{
              label: { color: "#f1f5f9" },
              input: {
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f1f5f9",
              },
            }}
          />

          <TextInput
            label={t("email.label")}
            placeholder={t("email.placeholder")}
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            styles={{
              label: { color: "#f1f5f9" },
              input: {
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f1f5f9",
              },
            }}
          />

          <TextInput
            label={t("subject.label")}
            placeholder={t("subject.placeholder")}
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            styles={{
              label: { color: "#f1f5f9" },
              input: {
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f1f5f9",
              },
            }}
          />

          <Textarea
            label={t("message.label")}
            placeholder={t("message.placeholder")}
            required
            autosize
            minRows={10}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            styles={{
              label: { color: "#f1f5f9" },
              input: {
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f1f5f9",
              },
            }}
          />

          <Button
            type="submit"
            size="md"
            disabled={!isFormValid}
            loading={loading}
            variant="gradient"
            gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
            style={{ fontWeight: 600 }}
          >
            {t("submit")}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
