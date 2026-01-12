import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { PWAUpdater } from "./pwa-updater";

const theme = createTheme({});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.livestreamrecorder.com"),
  title: {
    default:
      "Live Stream Recorder | Automatically Record Tiktok, Twitch & More",
    template: "%s | Live Stream Recorder",
  },
  description:
    "Never miss a live stream again. We automatically record your favorite streamers so you can watch later or download anytime. Free Twitch VOD downloads, Tiktok live stream recordings, and more.",
  keywords: [
    "live stream recorder",
    "stream recording",
    "record tiktok streams",
    "tiktok vod downloader",
    "tiktok live stream capture",
    "livestream recording",
    "recording streaming video",
    "stream capture software",
    "record live stream",
    "tiktok video recording",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Live Stream Recorder",
  },
  openGraph: {
    title: "Live Stream Recorder | Record Your Favorite Streams Automatically",
    description:
      "Follow your favorite streamers and never miss a broadcast. Automatic stream recording with free cloud storage. Watch or download anytime.",
    type: "website",
    siteName: "Live Stream Recorder",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Live Stream Recorder - Record TikTok, Twitch & More",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Stream Recorder | Record Tiktok, Twitch & More",
    description:
      "Automatically record and save live streams from your favorite creators. Free to start, watch anytime.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

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
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications color="red" position="bottom-center" />
          <NuqsAdapter>
            {children}
            <PWAUpdater />
          </NuqsAdapter>
        </MantineProvider>
      </body>
    </html>
  );
}
