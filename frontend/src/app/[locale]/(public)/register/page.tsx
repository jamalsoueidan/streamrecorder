import { generateAlternates } from "@/app/lib/seo";
import { getTranslations } from "next-intl/server";
import { RegisterChoices } from "./components/register-choices";

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
    alternates: generateAlternates("/register", locale),
  };
}

export default function RegisterPage() {
  return <RegisterChoices />;
}
