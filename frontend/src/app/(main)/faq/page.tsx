import api from "@/lib/api";
import { Container, Flex, Stack, Text, Title } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";
import { Questions } from "./components/questions";

export default async function FAQPage() {
  const response = await api.faq.getFaqs({ sort: "order:asc" });
  const faqs = response.data.data || [];

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
              Frequently Asked Questions
            </Title>
          </Flex>
          <Text size="md" style={{ color: "#64748b" }}>
            Find answers to common questions about our service.
          </Text>
        </Stack>

        <Questions leftColumn={leftColumn} rightColumn={rightColumn} />
      </Stack>
    </Container>
  );
}
