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
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { PWAUpdater } from "./pwa-updater";

const theme = createTheme({});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.livestreamrecorder.com"),
  title: {
    default:
      "Live Stream Recorder | Automatically Record TikTok, Twitch & More",
    template: "%s | Live Stream Recorder",
  },
  description:
    "Never miss a live stream again. Your favorite streamers are automatically recorded so you can watch later or download anytime. Free stream recording for TikTok, Twitch, YouTube, Kick & more.",
  keywords: [
    "live stream recorder",
    "stream recording",
    "livestream recording",
    "capture live stream",
    "capture video stream",
    "recording streaming video",
    "record twitch stream",
    "record tiktok live",
    "youtube live stream capture",
    "live stream screen recorder",
    "record youtube live stream",
    "twitch vod download",
    "tiktok live recording",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Live Stream Recorder",
  },
  openGraph: {
    title: "Live Stream Recorder | Capture Live Streams Automatically",
    description:
      "Follow your favorite streamers and never miss a live stream. Automatic stream recording with free cloud storage. Watch or download anytime.",
    type: "website",
    siteName: "Live Stream Recorder",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Live Stream Recorder - Record TikTok, Twitch, YouTube & More",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Live Stream Recorder | Capture Live Streams Automatically",
    description:
      "Live streams from your favorite creators are recorded and saved automatically. Free to start, watch or download anytime.",
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
        <Script
          defer
          src="/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
        />
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
