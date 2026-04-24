import { generateAlternates } from "@/app/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LoginForm } from "../components/login-form";

export async function generateMetadata() {
  const t = await getTranslations("login");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/login/email-password", locale),
  };
}

export default function EmailPasswordLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
