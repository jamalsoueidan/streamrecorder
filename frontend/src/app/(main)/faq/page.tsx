import api from "@/lib/api";
import { Container, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";
import { Questions } from "./components/questions";

export default async function FAQPage() {
  const response = await api.faq.getFaqs({ sort: "order:asc" });
  const faqs = response.data.data || [];

  // Split FAQs into two columns
  const midpoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midpoint);
  const rightColumn = faqs.slice(midpoint);

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Group gap="xs" mb="xs">
            <ThemeIcon variant="light" size="lg" color="blue">
              <IconQuestionMark size={20} />
            </ThemeIcon>
            <Title order={1}>Frequently Asked Questions</Title>
          </Group>
          <Text c="dimmed">
            Find answers to common questions about our service.
          </Text>
        </div>

        <Questions leftColumn={leftColumn} rightColumn={rightColumn} />
      </Stack>
    </Container>
  );
}
