import { cookies } from "next/headers";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Suspense } from "react";

interface LayoutProps {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "protected.dashboard" });
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}

async function DashboardLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  const cookieStore = await cookies();
  const navbarCollapsed = cookieStore.get("navbar-collapsed")?.value === "true";

  const user = await getUser();

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
