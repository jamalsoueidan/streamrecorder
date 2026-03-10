import { generateAlternates } from "@/app/lib/seo";
import { getTranslations } from "next-intl/server";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "forgotPassword" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/forgot-password", locale),
  };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
