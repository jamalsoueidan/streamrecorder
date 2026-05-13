"use client";

import { submitDMCA } from "@/app/actions/messages";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Paper,
  Radio,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Submitted } from "./submitted";

const inputStyles = {
  label: { color: "#f1f5f9" },
  description: { color: "#64748b" },
  input: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#f1f5f9",
  },
};

export function DMCAForm() {
  const t = useTranslations("dmca.form");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    workDescription: "",
    infringingUrls: searchParams.get("url") || "",
    copyrightType: "",
    firstName: "",
    lastName: "",
    email: "",
    goodFaith: false,
    accurate: false,
    acknowledge: false,
    signature: "",
  });
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { captcha, generateCaptcha } = useSimpleCaptcha();

  const expectedSignature =
    `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
  const signatureMatches =
    formData.signature.trim().toLowerCase() ===
      expectedSignature.toLowerCase() && expectedSignature.length > 0;

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayDisplay = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isFormValid =
    formData.workDescription.trim() &&
    formData.infringingUrls.trim() &&
    formData.copyrightType &&
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.goodFaith &&
    formData.accurate &&
    formData.acknowledge &&
    signatureMatches &&
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
      workDescription: formData.workDescription,
      infringingUrls: formData.infringingUrls,
      copyrightType: formData.copyrightType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      signature: formData.signature,
      signatureDate: todayIso,
      locale,
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
      <Title order={3} mb="xs" style={{ color: "#f1f5f9", fontWeight: 600 }}>
        {t("title")}
      </Title>
      <Text size="sm" style={{ color: "#64748b" }} mb="lg">
        {t("description")}
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack gap="xl">
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

          {/* ── Your copyrighted work ────────────────────────────────── */}
          <Section title={t("sections.yourWork")}>
            <Textarea
              label={t("work.description.label")}
              description={t("work.description.description")}
              placeholder={t("work.description.placeholder")}
              required
              minRows={4}
              autosize
              value={formData.workDescription}
              onChange={(e) =>
                setFormData({ ...formData, workDescription: e.target.value })
              }
              styles={inputStyles}
            />
          </Section>

          {/* ── Infringing content ──────────────────────────────────── */}
          <Section title={t("sections.infringing")}>
            <Textarea
              label={t("infringing.urls.label")}
              description={t("infringing.urls.description")}
              placeholder={t("infringing.urls.placeholder")}
              required
              minRows={4}
              autosize
              value={formData.infringingUrls}
              onChange={(e) =>
                setFormData({ ...formData, infringingUrls: e.target.value })
              }
              styles={inputStyles}
            />
          </Section>

          {/* ── Your role ───────────────────────────────────────────── */}
          <Section title={t("sections.yourRole")}>
            <Radio.Group
              label={t("copyrightType.label")}
              required
              value={formData.copyrightType}
              onChange={(value) =>
                setFormData({ ...formData, copyrightType: value })
              }
              styles={{ label: { color: "#f1f5f9" } }}
            >
              <Stack gap="xs" mt="xs">
                <Radio
                  value="personal"
                  label={t("copyrightType.personal")}
                  styles={{ label: { color: "#94a3b8" } }}
                />
                <Radio
                  value="authorized"
                  label={t("copyrightType.authorized")}
                  styles={{ label: { color: "#94a3b8" } }}
                />
              </Stack>
            </Radio.Group>
          </Section>

          {/* ── Contact information ─────────────────────────────────── */}
          <Section title={t("sections.contact")}>
            <Stack gap="md">
              <Flex gap="md" direction={{ base: "column", sm: "row" }}>
                <TextInput
                  label={t("contact.firstName.label")}
                  placeholder={t("contact.firstName.placeholder")}
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  styles={inputStyles}
                  style={{ flex: 1 }}
                />
                <TextInput
                  label={t("contact.lastName.label")}
                  placeholder={t("contact.lastName.placeholder")}
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  styles={inputStyles}
                  style={{ flex: 1 }}
                />
              </Flex>
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
                styles={inputStyles}
              />
            </Stack>
          </Section>

          {/* ── Sworn statements ────────────────────────────────────── */}
          <Section title={t("sections.sworn")}>
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
                  {t("perjury.title")}
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
                styles={{ label: { color: "#94a3b8" } }}
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
                styles={{ label: { color: "#94a3b8" } }}
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
                styles={{ label: { color: "#94a3b8" } }}
              />
            </Stack>
          </Section>

          {/* ── Signature ───────────────────────────────────────────── */}
          <Section title={t("sections.signature")}>
            <Stack gap="md">
              <div>
                <Text size="sm" fw={500} style={{ color: "#f1f5f9" }}>
                  {t("signature.date.label")}
                </Text>
                <Text size="sm" style={{ color: "#94a3b8" }} mt={4}>
                  {todayDisplay}
                </Text>
              </div>
              <TextInput
                label={t("signature.label")}
                description={t("signature.description")}
                placeholder={t("signature.placeholder")}
                required
                value={formData.signature}
                onChange={(e) =>
                  setFormData({ ...formData, signature: e.target.value })
                }
                error={
                  formData.signature.trim() && !signatureMatches
                    ? t("signature.mismatch")
                    : false
                }
                styles={inputStyles}
              />
            </Stack>
          </Section>

          {captcha.question && (
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
                styles={inputStyles}
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
          )}

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

          <Text size="xs" ta="center" mt="sm" style={{ color: "#64748b" }}>
            {t("footer")}
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Text
        size="xs"
        fw={700}
        tt="uppercase"
        style={{ color: "#94a3b8", letterSpacing: "0.08em" }}
        mb="md"
      >
        {title}
      </Text>
      <Divider mb="md" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
      {children}
    </div>
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
  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });

  useEffect(() => {
    setCaptcha(createCaptcha());
  }, []);

  const generateCaptcha = () => {
    setCaptcha(createCaptcha());
  };

  return { captcha, generateCaptcha };
}
