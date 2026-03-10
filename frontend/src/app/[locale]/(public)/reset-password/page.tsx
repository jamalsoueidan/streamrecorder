import { generateAlternates } from "@/app/lib/seo";
import { getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "./components/reset-password-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resetPassword" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/reset-password", locale),
  };
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
