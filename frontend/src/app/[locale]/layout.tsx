import { DeploymentChecker } from "@/app/components/deployment-checker";
import { FingerprintProvider } from "@/app/providers/fingerprint-provider";
import { theme } from "@/app/layout";
import { routing } from "@/i18n/routing";
import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <DirectionProvider initialDirection={dir} detectDirection={false}>
          <MantineProvider theme={theme} defaultColorScheme="dark">
            <ModalsProvider>
              <Notifications position="bottom-center" />
              <NuqsAdapter>
                <FingerprintProvider>
                  <NextIntlClientProvider messages={messages}>
                    <DeploymentChecker />
                    {children}
                  </NextIntlClientProvider>
                </FingerprintProvider>
              </NuqsAdapter>
            </ModalsProvider>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
