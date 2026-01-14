import { Stack, Title } from "@mantine/core";

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  return (
    <Stack pb={60} pt={40} px={20} gap="xl">
      <Title order={1}>{`Recordings`}</Title>
    </Stack>
  );
}
