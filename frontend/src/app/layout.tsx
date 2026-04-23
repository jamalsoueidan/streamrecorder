import "@mantine/charts/styles.css";
import { createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const theme = createTheme({
  components: {
    Notification: {
      styles: {
        title: { fontSize: 20, fontWeight: 600 },
        description: { fontSize: 18 },
      },
    },
  },
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Live Stream Recorder",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
