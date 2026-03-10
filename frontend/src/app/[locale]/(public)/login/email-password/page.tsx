import { generateAlternates } from "@/app/lib/seo";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "../components/login-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/login/email-password", locale),
  };
}

export default function EmailPasswordLoginPage() {
  return <LoginForm />;
}
