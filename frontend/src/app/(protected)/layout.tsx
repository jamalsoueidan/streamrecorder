import { getToken } from "@/lib/token";

import { redirect } from "next/navigation";
import api from "../../lib/api";

import { buildRulesFromStrapi } from "../lib/ability";
import { AbilityProvider } from "../providers/ability-provider";
import { NavigationProvider } from "../providers/navigation-provider";
import { QueryProvider } from "../providers/query-provider";
import { UserProvider } from "../providers/user-provider";
import { Shell } from "./_components/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  const user =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
      populate: "role",
    });

  const role = user?.data?.role || null;

  const permissions = await api.usersPermissionsUsersRoles.rolesDetail({
    id: role?.id?.toString() || "",
  });

  const rules = buildRulesFromStrapi(
    (permissions.data?.role as any)?.permissions || {}
  );

  const navigation = await api.navigation.getNavigation({ populate: "links" });

  return (
    <QueryProvider>
      <UserProvider user={user?.data}>
        <AbilityProvider rules={rules} role={role}>
          <NavigationProvider navigation={navigation?.data}>
            <Shell>{children}</Shell>
          </NavigationProvider>
        </AbilityProvider>
      </UserProvider>
    </QueryProvider>
  );
}
