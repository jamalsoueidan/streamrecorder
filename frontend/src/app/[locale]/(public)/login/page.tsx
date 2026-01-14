import { getTranslations } from "next-intl/server";
import { LoginForm } from "./components/login-form";

export async function generateMetadata() {
  const t = await getTranslations("login");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function LoginPage() {
  return <LoginForm />;
}
