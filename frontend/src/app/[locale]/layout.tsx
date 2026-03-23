import { DeploymentChecker } from "@/app/components/deployment-checker";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <NextIntlClientProvider messages={messages}>
      <DeploymentChecker />
      <div style={{ background: "#e03131", color: "white", textAlign: "center", padding: "8px 16px", fontSize: "14px", fontWeight: 500 }}>
        {t("banner")}
      </div>
      {children}
    </NextIntlClientProvider>
  );
}
