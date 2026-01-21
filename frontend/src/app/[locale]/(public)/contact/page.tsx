// app/[locale]/contact/page.tsx
import { Container, Stack, Text, Title } from "@mantine/core";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "./components/form";

export async function generateMetadata() {
  const t = await getTranslations("contact");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <Container size="md" style={{ position: "relative", zIndex: 1 }}>
      <Stack gap={32}>
        <Stack align="center" gap={16} mb={48}>
          <Title
            order={1}
            ta="center"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(99, 102, 241, 0.3))",
            }}
          >
            {t("header.title")}
          </Title>

          <Text
            size="xl"
            ta="center"
            maw={600}
            style={{ color: "#94a3b8", lineHeight: 1.7 }}
          >
            {t("header.subtitle")}
          </Text>
        </Stack>

        <ContactForm />
      </Stack>
    </Container>
  );
}
