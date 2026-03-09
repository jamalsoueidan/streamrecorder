import { redirect } from "next/navigation";

export default async function EmailConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmation?: string }>;
}) {
  const { confirmation } = await searchParams;

  if (!confirmation) {
    redirect("/login");
  }

  try {
    await fetch(
      `${process.env.STRAPI_URL || "http://localhost:1337"}/api/auth/email-confirmation?confirmation=${encodeURIComponent(confirmation)}`,
      { redirect: "manual" },
    );
  } catch {
    // confirmation failed, send to login
  }

  redirect("/login?email-confirmed=true");
}
