import { getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "./components/reset-password-form";

export async function generateMetadata() {
  const t = await getTranslations("resetPassword");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
