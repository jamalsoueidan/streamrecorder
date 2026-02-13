import { getToken } from "@/lib/token";
import { Box } from "@mantine/core";
import { Metadata } from "next";
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
  const token = await getToken();
  const isLoggedIn = !!token;

  return (
    <Box
      display="flex"
      style={{ flexDirection: "column", position: "relative", zIndex: 1 }}
    >
      <Header isLoggedIn={isLoggedIn} />
      <Box flex={1} mt="xl">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
