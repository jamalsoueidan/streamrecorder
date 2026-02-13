import { generateAlternates } from "@/app/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export async function generateMetadata() {
  const t = await getTranslations("forgotPassword");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/forgot-password", locale),
  };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
