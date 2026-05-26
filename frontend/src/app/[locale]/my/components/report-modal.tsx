"use client";

import { Button, Group, Modal, Radio, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
  entity: "recording" | "clip";
  documentId: string;
  opened: boolean;
  onClose: () => void;
}

const REASONS = [
  { value: "sexual", key: "sexual" },
  { value: "violent", key: "violent" },
  { value: "hateful", key: "hateful" },
  { value: "harmful", key: "harmful" },
  { value: "spam", key: "spam" },
] as const;

export function ReportModal({ entity, documentId, opened, onClose }: Props) {
  const t = useTranslations("protected.common.report");
  const locale = useLocale();
  const [reason, setReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/report-${entity}/${documentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, locale }),
      });

      if (!res.ok) throw new Error("report failed");

      notifications.show({
        title: t("thanks"),
        message: null,
        color: "green",
      });
      setReason("");
      onClose();
    } catch {
      notifications.show({
        title: t("failed"),
        message: null,
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("title")} centered>
      <Stack>
        <Radio.Group value={reason} onChange={setReason}>
          <Stack gap="sm">
            {REASONS.map((r) => (
              <Radio
                key={r.value}
                value={r.value}
                label={t(`reasons.${r.key}`)}
              />
            ))}
          </Stack>
        </Radio.Group>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose} disabled={submitting}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!reason} loading={submitting}>
            {t("submit")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
