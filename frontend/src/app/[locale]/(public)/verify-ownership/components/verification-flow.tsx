"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Card,
  CopyButton,
  Flex,
  Paper,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  Icon123,
  IconAlertCircle,
  IconCheck,
  IconClipboard,
  IconClock,
  IconExternalLink,
  IconUpload,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
import { parseUsername } from "@/app/lib/parse-username";
import {
  verifyProfile,
  submitManualVerification,
} from "../actions/verify-profile";

function generateVerificationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "LSR-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function VerificationFlow({ intent }: { intent: string }) {
  const t = useTranslations("verifyOwnership");
  const [active, setActive] = useState(0);
  const [profileUrl, setProfileUrl] = useState("");
  const [email, setEmail] = useState("");
  const [urlError, setUrlError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [verificationCode] = useState(() => generateVerificationCode());
  const [verifying, setVerifying] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [manualRequest, setManualRequest] = useState(false);
  const [submittingManual, setSubmittingManual] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [actionResult, setActionResult] = useState<
    "created" | "linked" | "deleted" | "not_found" | null
  >(null);
  const [deletedCount, setDeletedCount] = useState(0);

  const profileInfo = useMemo(() => {
    if (!profileUrl) return null;
    const parsed = parseUsername(profileUrl);
    if (!parsed.platform) return null;
    return { platform: parsed.platform, username: parsed.username };
  }, [profileUrl]);

  const handleContinueToStep2 = () => {
    let hasError = false;

    if (!profileUrl.trim()) {
      setUrlError(t("steps.enterUrl.error.required"));
      hasError = true;
    } else if (!profileInfo) {
      setUrlError(t("steps.enterUrl.error.invalid"));
      hasError = true;
    } else {
      setUrlError("");
    }

    if (!email.trim()) {
      setEmailError(t("steps.enterUrl.error.emailRequired"));
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t("steps.enterUrl.error.emailInvalid"));
      hasError = true;
    } else {
      setEmailError("");
    }

    if (hasError) return;
    setActive(1);
  };

  const handleVerify = async () => {
    if (!profileInfo) return;

    setVerifying(true);
    setVerificationFailed(false);

    const result = await verifyProfile({
      profileUrl,
      platform: profileInfo.platform,
      username: profileInfo.username,
      verificationCode,
      email,
      intent,
    });

    setVerifying(false);

    if (result.verified) {
      if (result.success && result.action) {
        setActionResult(result.action);
        if (result.deletedCount !== undefined) {
          setDeletedCount(result.deletedCount);
        }
      } else if (!result.success && result.error) {
        // Profile verified but not found in our system
        setActionResult("not_found");
      }
      setActive(2);
    } else {
      setVerificationFailed(true);
    }
  };

  const handleManualRequest = async () => {
    if (!profileInfo) return;

    setSubmittingManual(true);

    const result = await submitManualVerification({
      profileUrl,
      platform: profileInfo.platform,
      username: profileInfo.username,
      verificationCode,
      additionalInfo,
      intent,
    });

    setSubmittingManual(false);

    if (result.success) {
      setSubmitted(true);
      setActive(2);
    }
  };

  return (
    <Paper
      p="xl"
      radius="lg"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        color="teal"
        styles={{
          stepLabel: { color: "#f1f5f9" },
          stepDescription: { color: "#64748b" },
        }}
      >
        {/* Step 1: Enter Profile URL */}
        <Stepper.Step
          label={t("steps.enterUrl.label")}
          description={t("steps.enterUrl.description")}
        >
          <Stack gap="lg" mt="xl">
            <Text style={{ color: "#94a3b8" }}>
              {t("steps.enterUrl.intro")}
            </Text>

            <TextInput
              label={t("steps.enterUrl.input.label")}
              placeholder={t("steps.enterUrl.input.placeholder")}
              value={profileUrl}
              onChange={(e) => {
                setProfileUrl(e.target.value);
                setUrlError("");
              }}
              error={urlError}
              size="md"
              styles={{
                label: { color: "#f1f5f9" },
                input: {
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#f1f5f9",
                },
              }}
            />

            {profileInfo && (
              <Paper
                p="md"
                radius="md"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                <Flex align="center" gap="sm">
                  <IconCheck size={18} style={{ color: "#10b981" }} />
                  <Text size="sm" style={{ color: "#6ee7b7" }}>
                    {t("steps.enterUrl.detected", {
                      platform: profileInfo.platform,
                      username: profileInfo.username,
                    })}
                  </Text>
                </Flex>
              </Paper>
            )}

            <TextInput
              label={t("steps.enterUrl.email.label")}
              placeholder={t("steps.enterUrl.email.placeholder")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              error={emailError}
              size="md"
              type="email"
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
              size="md"
              variant="gradient"
              gradient={{ from: "#6366f1", to: "#a855f7" }}
              onClick={handleContinueToStep2}
              disabled={!profileUrl.trim() || !email.trim()}
            >
              {t("steps.enterUrl.continue")}
            </Button>
          </Stack>
        </Stepper.Step>

        {/* Step 2: Verify Ownership */}
        <Stepper.Step
          label={t("steps.verify.label")}
          description={t("steps.verify.description")}
        >
          <Stack gap="lg" mt="xl">
            <Text style={{ color: "#94a3b8" }}>{t("steps.verify.intro")}</Text>

            <Card
              padding="lg"
              radius="md"
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
              }}
            >
              <Stack gap="md">
                <Text fw={600} style={{ color: "#f1f5f9" }}>
                  {t("steps.verify.codeLabel")}
                </Text>
                <Flex align="center" gap="md">
                  <Text
                    size="xl"
                    fw={700}
                    style={{
                      color: "#a5b4fc",
                      fontFamily: "monospace",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {verificationCode}
                  </Text>
                  <CopyButton value={verificationCode}>
                    {({ copied, copy }) => (
                      <Tooltip
                        label={copied ? t("common.copied") : t("common.copy")}
                      >
                        <ActionIcon
                          variant="subtle"
                          color={copied ? "teal" : "gray"}
                          onClick={copy}
                        >
                          {copied ? (
                            <IconCheck size={18} />
                          ) : (
                            <IconClipboard size={18} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Flex>
                <Text size="sm" style={{ color: "#94a3b8" }}>
                  {t("steps.verify.instructions")}
                </Text>
                {profileInfo && (
                  <Button
                    component="a"
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="light"
                    color="indigo"
                    rightSection={<IconExternalLink size={16} />}
                  >
                    {t("steps.verify.openProfile", {
                      platform: profileInfo.platform,
                    })}
                  </Button>
                )}
              </Stack>
            </Card>

            <Button
              size="md"
              variant="gradient"
              gradient={{ from: "#10b981", to: "#059669" }}
              onClick={handleVerify}
              loading={verifying}
            >
              {t("steps.verify.verifyButton")}
            </Button>

            {verificationFailed && !manualRequest && (
              <Alert
                icon={<IconAlertCircle size={18} />}
                color="yellow"
                variant="light"
                title={t("steps.verify.failed.title")}
              >
                <Stack gap="md">
                  <Text size="sm">{t("steps.verify.failed.message")}</Text>
                  <Button
                    variant="light"
                    color="yellow"
                    leftSection={<IconUpload size={16} />}
                    onClick={() => setManualRequest(true)}
                  >
                    {t("steps.verify.failed.manualButton")}
                  </Button>
                </Stack>
              </Alert>
            )}

            {manualRequest && (
              <Card
                padding="lg"
                radius="md"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <Stack gap="md">
                  <Title order={4} style={{ color: "#f1f5f9" }}>
                    {t("steps.verify.manual.title")}
                  </Title>
                  <Text size="sm" style={{ color: "#94a3b8" }}>
                    {t("steps.verify.manual.description")}
                  </Text>
                  <Textarea
                    label={t("steps.verify.manual.input.label")}
                    placeholder={t("steps.verify.manual.input.placeholder")}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    minRows={3}
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
                    variant="gradient"
                    gradient={{ from: "#6366f1", to: "#a855f7" }}
                    leftSection={<IconClock size={16} />}
                    onClick={handleManualRequest}
                    loading={submittingManual}
                  >
                    {t("steps.verify.manual.submit")}
                  </Button>
                </Stack>
              </Card>
            )}
          </Stack>
        </Stepper.Step>

        {/* Step 3: Complete */}
        <Stepper.Completed>
          <Stack gap="lg" mt="xl" align="center">
            {submitted ? (
              <>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(99, 102, 241, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconClock size={40} style={{ color: "#a5b4fc" }} />
                </div>
                <Title order={2} ta="center" style={{ color: "#f1f5f9" }}>
                  {t("steps.complete.pending.title")}
                </Title>
                <Text ta="center" style={{ color: "#94a3b8" }} maw={400}>
                  {t("steps.complete.pending.message")}
                </Text>
              </>
            ) : actionResult === "deleted" ? (
              <>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconCheck size={40} style={{ color: "#10b981" }} />
                </div>
                <Title order={2} ta="center" style={{ color: "#f1f5f9" }}>
                  {t("steps.complete.deleted.title")}
                </Title>
                <Text ta="center" style={{ color: "#94a3b8" }} maw={400}>
                  {t("steps.complete.deleted.message", { count: deletedCount })}
                </Text>
              </>
            ) : actionResult === "linked" ? (
              <>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconCheck size={40} style={{ color: "#10b981" }} />
                </div>
                <Title order={2} ta="center" style={{ color: "#f1f5f9" }}>
                  {t("steps.complete.linked.title")}
                </Title>
                <Text ta="center" style={{ color: "#94a3b8" }} maw={400}>
                  {t("steps.complete.linked.message")}
                </Text>
                <Button
                  component={Link}
                  href="/login"
                  size="md"
                  variant="gradient"
                  gradient={{ from: "#6366f1", to: "#a855f7" }}
                >
                  {t("steps.complete.linked.button")}
                </Button>
              </>
            ) : actionResult === "created" ? (
              <>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconCheck size={40} style={{ color: "#10b981" }} />
                </div>
                <Title order={2} ta="center" style={{ color: "#f1f5f9" }}>
                  {t("steps.complete.created.title")}
                </Title>
                <Text ta="center" style={{ color: "#94a3b8" }} maw={400}>
                  {t("steps.complete.created.message")}
                </Text>
                <Button
                  component={Link}
                  href="/my-list"
                  size="md"
                  variant="gradient"
                  gradient={{ from: "#6366f1", to: "#a855f7" }}
                >
                  {t("steps.complete.created.button")}
                </Button>
              </>
            ) : actionResult === "not_found" ? (
              <>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(251, 191, 36, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconAlertCircle size={40} style={{ color: "#fbbf24" }} />
                </div>
                <Title order={2} ta="center" style={{ color: "#f1f5f9" }}>
                  {t("steps.complete.notFound.title")}
                </Title>
                <Text ta="center" style={{ color: "#94a3b8" }} maw={400}>
                  {t("steps.complete.notFound.message")}
                </Text>
              </>
            ) : null}
          </Stack>
        </Stepper.Completed>
      </Stepper>
    </Paper>
  );
}
