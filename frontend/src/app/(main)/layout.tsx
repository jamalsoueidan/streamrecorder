import { Box } from "@mantine/core";

import { Footer } from "./_components/footer";
import { HeaderMenu } from "./_components/header-menu";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      display="flex"
      style={{ flexDirection: "column", position: "relative", zIndex: 1 }}
    >
      <HeaderMenu />
      <Box flex={1}>{children}</Box>
      <Footer />
    </Box>
  );
}
