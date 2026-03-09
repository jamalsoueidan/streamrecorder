import { Box } from "@mantine/core";
import { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      display="flex"
      style={{ flexDirection: "column", position: "relative", zIndex: 1 }}
    >
      <Suspense>
        <Header />
      </Suspense>
      <Box flex={1} mt="xl">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
