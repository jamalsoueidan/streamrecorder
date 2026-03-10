import { generateAlternates } from "@/app/lib/seo";
import { getTranslations } from "next-intl/server";
import { LoginChoices } from "./components/login-choices";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/login", locale),
  };
}

export default function LoginPage() {
  return <LoginChoices />;
}
