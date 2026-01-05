import { Box } from "@mantine/core";

import { Footer } from "./components/footer";
import { Header } from "./components/header";

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
      <Header />
      <Box flex={1}>{children}</Box>
      <Footer />
    </Box>
  );
}
