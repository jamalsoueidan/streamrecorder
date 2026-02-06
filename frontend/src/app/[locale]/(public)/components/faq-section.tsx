import { Flex, Stack, Text, Title } from "@mantine/core";
import { IconChevronDown, IconQuestionMark } from "@tabler/icons-react";
import styles from "./faq-section.module.css";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
}

export function FAQSection({ faqs, title, subtitle }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const midpoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midpoint);
  const rightColumn = faqs.slice(midpoint);

  return (
    <Stack gap={32}>
      {(title || subtitle) && (
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
            {title && (
              <Title
                order={2}
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
                {title}
              </Title>
            )}
          </Flex>
          {subtitle && (
            <Text size="md" style={{ color: "#64748b" }}>
              {subtitle}
            </Text>
          )}
        </Stack>
      )}

      <Flex gap={24} direction={{ base: "column", md: "row" }}>
        <Stack gap={16} style={{ flex: 1 }}>
          {leftColumn.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </Stack>
        <Stack gap={16} style={{ flex: 1 }}>
          {rightColumn.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </Stack>
      </Flex>
    </Stack>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        <Text fw={500} style={{ color: "#f1f5f9" }}>
          {question}
        </Text>
        <div className={styles.chevron}>
          <IconChevronDown size={20} />
        </div>
      </summary>
      <Text
        className={styles.answer}
        style={{
          color: "#94a3b8",
          lineHeight: 1.7,
        }}
      >
        {answer}
      </Text>
    </details>
  );
}
