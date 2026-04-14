import { getToken } from "@/lib/token";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("protected.dashboard");
  return {
    title: `${t("title")} | LiveStreamRecorder`,
  };
}

import { getUser } from "@/app/actions/user";
import { buildRulesFromStrapi } from "@/app/lib/ability";
import { AbilityProvider } from "@/app/providers/ability-provider";
import { QueryProvider } from "@/app/providers/query-provider";
import { UserProvider } from "@/app/providers/user-provider";
import api from "@/lib/api";
import { SerwistProvider } from "../../serwist";
import { Shell } from "./components/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const navbarCollapsed = cookieStore.get("navbar-collapsed")?.value === "true";

  let user;
  try {
    user = await getUser();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      redirect("/api/logout");
    }
    throw error;
  }

  const role = user?.data?.role || null;

  const permissions = await api.usersPermissionsUsersRoles.rolesDetail({
    id: role?.id?.toString() || "",
  });

  const rules = buildRulesFromStrapi(
    (permissions.data?.role as any)?.permissions || {},
  );

  return (
    <SerwistProvider swUrl="/serwist/sw.js">
      <QueryProvider>
        <UserProvider user={user?.data}>
          <AbilityProvider rules={rules} role={role}>
            <Shell initialCollapsed={navbarCollapsed}>{children}</Shell>
          </AbilityProvider>
        </UserProvider>
      </QueryProvider>
    </SerwistProvider>
  );
}
