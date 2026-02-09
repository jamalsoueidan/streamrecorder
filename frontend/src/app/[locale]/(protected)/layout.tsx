import { getToken } from "@/lib/token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  const user =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
      populate: "role",
    });

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
