import { generateAlternates } from "@/app/lib/seo";
import { getTranslations } from "next-intl/server";
import { RegisterForm } from "../components/register-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "register" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/register/email-password", locale),
  };
}

export default function EmailPasswordRegisterPage() {
  return <RegisterForm />;
}
