import { Box } from "@mantine/core";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.meta");
  const locale = await getLocale();

  return {
    metadataBase: new URL("https://www.livestreamrecorder.com"),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: t("keywords").split(", "),
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Live Stream Recorder",
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      siteName: "Live Stream Recorder",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("twitterDescription"),
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
}

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
