"use client";
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  Radio,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCheck,
  IconRefresh,
  IconScale,
} from "@tabler/icons-react";
import { useState } from "react";

// Simple math CAPTCHA - no API keys needed
function createCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const isAddition = Math.random() > 0.5;

  if (isAddition) {
    return { question: `${num1} + ${num2}`, answer: num1 + num2 };
  } else {
    // Make sure we don't get negative numbers
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

export default function DMCAPolicy() {
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

    // Check captcha
    if (parseInt(captchaInput) !== captcha.answer) {
      setCaptchaError(true);
      setCaptchaInput("");
      generateCaptcha();
      return;
    }

    setCaptchaError(false);
    setLoading(true);

    // TODO: Replace with your actual API call
    // await fetch('/api/dmca', { method: 'POST', body: JSON.stringify(formData) });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder p="xl" radius="md">
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="xl" color="green">
              <IconCheck size={30} />
            </ThemeIcon>
            <Title order={2} ta="center">
              DMCA Request Submitted
            </Title>
            <Text c="dimmed" ta="center">
              We have received your DMCA takedown request. We will review it and
              respond to the email address you provided.
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <div>
          <Group gap="xs" mb="xs">
            <ThemeIcon variant="light" size="lg" color="blue">
              <IconScale size={20} />
            </ThemeIcon>
            <Title order={1}>Digital Millennium Copyright Act</Title>
          </Group>
          <Text c="dimmed">DMCA Policy</Text>
        </div>

        <Paper withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            Notification of Claimed Infringement
          </Title>
          <Text c="dimmed" mb="lg">
            Please use this form to request the removal of recordings under the
            DMCA.
          </Text>

          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              <TextInput
                label="The following content"
                description="Provide the URL(s) or description of the infringing content"
                placeholder="https://example.com/recording/..."
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />

              <Radio.Group
                label="Please choose one"
                required
                value={formData.copyrightType}
                onChange={(value) =>
                  setFormData({ ...formData, copyrightType: value })
                }
              >
                <Stack gap="xs" mt="xs">
                  <Radio
                    value="personal"
                    label="Infringes on my personal copyright"
                  />
                  <Radio
                    value="authorized"
                    label="Infringes on the copyright of someone I am authorized to represent"
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
              />

              <Divider my="sm" />

              <div>
                <Text fw={500} mb="xs">
                  By checking the following boxes, I state UNDER PENALTY OF
                  PERJURY that:
                </Text>
                <Alert
                  variant="light"
                  color="orange"
                  icon={<IconAlertCircle size={18} />}
                  mb="md"
                >
                  Please read each statement carefully before checking.
                </Alert>

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
                  />
                </Stack>
              </div>

              <Divider my="sm" />

              <TextInput
                label="Digital Signature"
                description="Typing your full name in this box will act as your digital signature"
                placeholder="Your full legal name"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />

              {/* Simple Math CAPTCHA */}
              <div>
                <Group gap="xs" align="flex-end">
                  <TextInput
                    label="Verification"
                    description={`What is ${captcha.question}?`}
                    placeholder="Your answer"
                    required
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    error={captchaError && "Wrong answer, try again"}
                    style={{ flex: 1 }}
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
                  >
                    <IconRefresh size={18} />
                  </Button>
                </Group>
              </div>

              <Button
                type="submit"
                size="md"
                disabled={!isFormValid}
                loading={loading}
              >
                Submit DMCA Request
              </Button>
            </Stack>
          </form>
        </Paper>

        <Text size="sm" c="dimmed" ta="center">
          We respond to all valid DMCA requests. Abuse of this process may
          result in legal consequences.
        </Text>
      </Stack>
    </Container>
  );
}
