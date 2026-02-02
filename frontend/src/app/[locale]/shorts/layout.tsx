import { getToken } from "@/lib/token";
import { Box } from "@mantine/core";
import { Header } from "../(public)/components/header";

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

      {children}
    </Box>
  );
}
