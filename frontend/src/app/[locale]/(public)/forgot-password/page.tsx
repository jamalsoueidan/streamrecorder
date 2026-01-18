import { getTranslations } from "next-intl/server";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export async function generateMetadata() {
  const t = await getTranslations("forgotPassword");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
