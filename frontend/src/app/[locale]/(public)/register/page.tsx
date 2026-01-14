import { getTranslations } from "next-intl/server";

import { RegisterForm } from "./components/register-form";

export async function generateMetadata() {
  const t = await getTranslations("register");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function RegisterPage() {
  return <RegisterForm />;
}
