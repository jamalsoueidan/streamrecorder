import { generateAlternates } from "@/app/lib/seo";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { RegisterChoices } from "./components/register-choices";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "register" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/register", locale),
  };
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterChoices />
    </Suspense>
  );
}
