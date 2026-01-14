import { Container, Flex, Stack, Text, Title } from "@mantine/core";
import { IconScale } from "@tabler/icons-react";
import { DMCAForm } from "./components/form";

export default function DMCAPolicy() {
  return (
    <Container size="md" style={{ position: "relative", zIndex: 1 }}>
      <Stack gap={32}>
        {/* Header */}
        <Stack align="center" gap={12} mb={24}>
          <Flex gap={12} align="center" justify="center">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <IconScale size={24} />
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
              Digital Millennium Copyright Act
            </Title>
          </Flex>
          <Text size="sm" style={{ color: "#64748b" }}>
            DMCA Policy
          </Text>
        </Stack>

        <DMCAForm />

        <Text size="sm" ta="center" style={{ color: "#64748b" }}>
          We respond to all valid DMCA requests. Abuse of this process may
          result in legal consequences.
        </Text>
      </Stack>
    </Container>
  );
}
