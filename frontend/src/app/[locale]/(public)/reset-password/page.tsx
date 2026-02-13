import { generateAlternates } from "@/app/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "./components/reset-password-form";

export async function generateMetadata() {
  const t = await getTranslations("resetPassword");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/reset-password", locale),
  };
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
