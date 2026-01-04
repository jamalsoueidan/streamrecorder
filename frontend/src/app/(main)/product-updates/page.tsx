import api from "@/lib/api";
import { Container, Paper, Stack, Text, Title } from "@mantine/core";
import { IconGitBranch } from "@tabler/icons-react";
import { ChangeLogTimeline } from "./components/change-log-timeline";

export default async function ChangelogPage() {
  const response = await api.changeLog.getChangeLogs({
    sort: "createdAt:desc",
  });

  const changelogs = response.data?.data || [];

  return (
    <Container size="md" style={{ position: "relative", zIndex: 1 }}>
      <Stack align="center" gap="md" mb={60}>
        <Title
          order={1}
          ta="center"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
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
          Changelog
        </Title>
        <Text
          size="xl"
          ta="center"
          maw={600}
          style={{ color: "#94a3b8", lineHeight: 1.7 }}
        >
          Stay up to date with the latest features, improvements, and fixes.
        </Text>
      </Stack>

      {changelogs.length === 0 ? (
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Stack align="center" gap="md">
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(100, 116, 139, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              <IconGitBranch size={30} />
            </div>
            <Title order={3} style={{ color: "#f1f5f9" }}>
              No changelog entries yet
            </Title>
            <Text style={{ color: "#64748b" }}>
              Check back soon for updates.
            </Text>
          </Stack>
        </Paper>
      ) : (
        <ChangeLogTimeline changelogs={changelogs} />
      )}
    </Container>
  );
}
