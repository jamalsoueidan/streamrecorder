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
import { useState } from "react";
import { Submitted } from "./submitted";

export function DMCAForm() {
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
        Notification of Claimed Infringement
      </Title>
      <Text style={{ color: "#64748b" }} mb="lg">
        Please use this form to request the removal of recordings under the
        DMCA.
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
            label="The following content"
            description="Provide the URL(s) or description of the infringing content"
            placeholder="https://example.com/recording/..."
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
            label="Please choose one"
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
                label="Infringes on my personal copyright"
                styles={{
                  label: { color: "#94a3b8" },
                }}
              />
              <Radio
                value="authorized"
                label="Infringes on the copyright of someone I am authorized to represent"
                styles={{
                  label: { color: "#94a3b8" },
                }}
              />
            </Stack>
          </Radio.Group>

          <TextInput
            label="Your email address"
            description="We will use this to respond to your request"
            placeholder="you@example.com"
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
              By checking the following boxes, I state UNDER PENALTY OF PERJURY
              that:
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
                  Please read each statement carefully before checking.
                </Text>
              </Flex>
            </Paper>

            <Stack gap="md">
              <Checkbox
                label="I hereby state that I have a good faith belief that the sharing of copyrighted material at the location above is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)."
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
                label="I hereby state that the information in this Notice is accurate and, under penalty of perjury, that I am the owner, or authorized to act on behalf of, the owner, of the copyright or of an exclusive right under the copyright that is allegedly infringed."
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
                label="I acknowledge that under Section 512(f) any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages."
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
            label="Digital Signature"
            description="Typing your full name in this box will act as your digital signature"
            placeholder="Your full legal name"
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
                label="Verification"
                description={`What is ${captcha.question}?`}
                placeholder="Your answer"
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                error={captchaError && "Wrong answer, try again"}
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
            Submit DMCA Request
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
