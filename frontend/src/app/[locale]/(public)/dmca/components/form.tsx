"use client";

import { submitDMCA } from "@/app/actions/messages";
import {
  Button,
  Checkbox,
  Flex,
  Paper,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Submitted } from "./submitted";

export function DMCAForm() {
  const t = useTranslations("dmca.form");
  const [formData, setFormData] = useState({
    content: "",
    copyrightType: "",
    email: "",
    fullName: "",
    goodFaith: false,
    accurate: false,
    acknowledge: false,
  });
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { captcha, generateCaptcha } = useSimpleCaptcha();

  const isFormValid =
    formData.content.trim() &&
    formData.copyrightType &&
    formData.email.trim() &&
    formData.fullName.trim() &&
    formData.goodFaith &&
    formData.accurate &&
    formData.acknowledge &&
    captchaInput.trim();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (parseInt(captchaInput) !== captcha.answer) {
      setCaptchaError(true);
      setCaptchaInput("");
      generateCaptcha();
      return;
    }

    setCaptchaError(false);
    setError(null);
    setLoading(true);

    const result = await submitDMCA({
      content: formData.content,
      copyrightType: formData.copyrightType,
      email: formData.email,
      fullName: formData.fullName,
    });

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong");
      generateCaptcha();
      setCaptchaInput("");
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
            label={t("content.label")}
            description={t("content.description")}
            placeholder={t("content.placeholder")}
            required
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            styles={{
              label: { color: "#f1f5f9" },
              description: { color: "#64748b" },
              input: {
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f1f5f9",
              },
            }}
          />

          <Radio.Group
            label={t("copyrightType.label")}
            required
            value={formData.copyrightType}
            onChange={(value) =>
              setFormData({ ...formData, copyrightType: value })
            }
            styles={{
              label: { color: "#f1f5f9" },
            }}
          >
            <Stack gap="xs" mt="xs">
              <Radio
                value="personal"
                label={t("copyrightType.personal")}
                styles={{
                  label: { color: "#94a3b8" },
                }}
              />
              <Radio
                value="authorized"
                label={t("copyrightType.authorized")}
                styles={{
                  label: { color: "#94a3b8" },
                }}
              />
            </Stack>
          </Radio.Group>

          <TextInput
            label={t("email.label")}
            description={t("email.description")}
            placeholder={t("email.placeholder")}
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            styles={{
              label: { color: "#f1f5f9" },
              description: { color: "#64748b" },
              input: {
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f1f5f9",
              },
            }}
          />

          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              margin: "8px 0",
            }}
          />

          <div>
            <Text fw={500} mb="xs" style={{ color: "#f1f5f9" }}>
              {t("perjury.title")}
            </Text>
            <Paper
              p="md"
              radius="md"
              mb="md"
              style={{
                background: "rgba(249, 115, 22, 0.1)",
                border: "1px solid rgba(249, 115, 22, 0.2)",
              }}
            >
              <Flex gap={8} align="center">
                <IconAlertCircle size={18} style={{ color: "#f97316" }} />
                <Text size="sm" style={{ color: "#fdba74" }}>
                  {t("perjury.warning")}
                </Text>
              </Flex>
            </Paper>

            <Stack gap="md">
              <Checkbox
                label={t("perjury.goodFaith")}
                checked={formData.goodFaith}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    goodFaith: e.currentTarget.checked,
                  })
                }
                styles={{
                  label: { color: "#94a3b8" },
                }}
              />
              <Checkbox
                label={t("perjury.accurate")}
                checked={formData.accurate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accurate: e.currentTarget.checked,
                  })
                }
                styles={{
                  label: { color: "#94a3b8" },
                }}
              />
              <Checkbox
                label={t("perjury.acknowledge")}
                checked={formData.acknowledge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    acknowledge: e.currentTarget.checked,
                  })
                }
                styles={{
                  label: { color: "#94a3b8" },
                }}
              />
            </Stack>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              margin: "8px 0",
            }}
          />

          <TextInput
            label={t("signature.label")}
            description={t("signature.description")}
            placeholder={t("signature.placeholder")}
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            styles={{
              label: { color: "#f1f5f9" },
              description: { color: "#64748b" },
              input: {
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f1f5f9",
              },
            }}
          />

          <div>
            <Flex gap="xs" align="flex-end">
              <TextInput
                label={t("captcha.label")}
                description={t("captcha.description", {
                  question: captcha.question,
                })}
                placeholder={t("captcha.placeholder")}
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                error={captchaError && t("captcha.error")}
                style={{ flex: 1 }}
                styles={{
                  label: { color: "#f1f5f9" },
                  description: { color: "#64748b" },
                  input: {
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#f1f5f9",
                  },
                }}
              />
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  generateCaptcha();
                  setCaptchaInput("");
                  setCaptchaError(false);
                }}
                title="New question"
                style={{ color: "#94a3b8" }}
              >
                <IconRefresh size={18} />
              </Button>
            </Flex>
          </div>

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

function createCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const isAddition = Math.random() > 0.5;

  if (isAddition) {
    return { question: `${num1} + ${num2}`, answer: num1 + num2 };
  } else {
    const [a, b] = num1 >= num2 ? [num1, num2] : [num2, num1];
    return { question: `${a} - ${b}`, answer: a - b };
  }
}

function useSimpleCaptcha() {
  const [captcha, setCaptcha] = useState(createCaptcha);

  const generateCaptcha = () => {
    setCaptcha(createCaptcha());
  };

  return { captcha, generateCaptcha };
}
