import { generateAlternates } from "@/app/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";

import { RegisterForm } from "./components/register-form";

export async function generateMetadata() {
  const t = await getTranslations("register");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/register", locale),
  };
}
export default function RegisterPage() {
  return <RegisterForm />;
}
