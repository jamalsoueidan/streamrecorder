import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import type { Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { PWAUpdater } from "./pwa-updater";

const theme = createTheme({});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <Script
          defer
          src="/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <DirectionProvider initialDirection={dir} detectDirection={false}>
          <MantineProvider theme={theme} defaultColorScheme="dark">
            <Notifications color="red" position="bottom-center" />
            <NuqsAdapter>
              {children}
              <PWAUpdater />
            </NuqsAdapter>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
