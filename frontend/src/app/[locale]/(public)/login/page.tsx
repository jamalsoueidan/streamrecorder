import { generateAlternates } from "@/app/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";
import { LoginForm } from "./components/login-form";

export async function generateMetadata() {
  const t = await getTranslations("login");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/login", locale),
  };
}

export default function LoginPage() {
  return <LoginForm />;
}
