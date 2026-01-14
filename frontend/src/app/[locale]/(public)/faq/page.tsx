"use client";

import { Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import { IconChevronDown, IconQuestionMark } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Paper
      p="md"
      radius="lg"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        cursor: "pointer",
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <Flex justify="space-between" align="center" gap="md">
        <Text fw={500} style={{ color: "#f1f5f9" }}>
          {question}
        </Text>
        <div
          style={{
            color: "#64748b",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          <IconChevronDown size={20} />
        </div>
      </Flex>
      {isOpen && (
        <Text
          mt="md"
          style={{
            color: "#94a3b8",
            lineHeight: 1.7,
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: 12,
          }}
        >
          {answer}
        </Text>
      )}
    </Paper>
  );
}

export default function FAQPage() {
  const t = useTranslations("faq");

  const faqs = [
    { question: t("faqs.0.question"), answer: t("faqs.0.answer") },
    { question: t("faqs.1.question"), answer: t("faqs.1.answer") },
    { question: t("faqs.2.question"), answer: t("faqs.2.answer") },
    { question: t("faqs.3.question"), answer: t("faqs.3.answer") },
    { question: t("faqs.4.question"), answer: t("faqs.4.answer") },
    { question: t("faqs.5.question"), answer: t("faqs.5.answer") },
    { question: t("faqs.6.question"), answer: t("faqs.6.answer") },
    { question: t("faqs.7.question"), answer: t("faqs.7.answer") },
    { question: t("faqs.8.question"), answer: t("faqs.8.answer") },
    { question: t("faqs.9.question"), answer: t("faqs.9.answer") },
    { question: t("faqs.10.question"), answer: t("faqs.10.answer") },
    { question: t("faqs.11.question"), answer: t("faqs.11.answer") },
    { question: t("faqs.12.question"), answer: t("faqs.12.answer") },
    { question: t("faqs.13.question"), answer: t("faqs.13.answer") },
    { question: t("faqs.14.question"), answer: t("faqs.14.answer") },
  ];

  const midpoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midpoint);
  const rightColumn = faqs.slice(midpoint);

  return (
    <Container size="lg" style={{ position: "relative", zIndex: 1 }}>
      <Stack gap={32}>
        {/* Header */}
        <Stack align="center" gap={12} mb={24}>
          <Flex gap={12} align="center" justify="center">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "rgba(99, 102, 241, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
              }}
            >
              <IconQuestionMark size={24} />
            </div>
            <Title
              order={1}
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                fontWeight: 800,
                lineHeight: 1.3,
                letterSpacing: "-0.03em",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                paddingBottom: "0.1em",
              }}
            >
              {t("title")}
            </Title>
          </Flex>
          <Text size="md" style={{ color: "#64748b" }}>
            {t("subtitle")}
          </Text>
        </Stack>

        {/* Questions */}
        <Flex gap={24} direction={{ base: "column", md: "row" }}>
          <Stack gap={16} style={{ flex: 1 }}>
            {leftColumn.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </Stack>
          <Stack gap={16} style={{ flex: 1 }}>
            {rightColumn.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
}
