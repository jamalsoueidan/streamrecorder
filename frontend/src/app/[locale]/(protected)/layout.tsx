import { getToken } from "@/lib/token";

import { redirect } from "next/navigation";

import publicApi from "@/lib/public-api";

import { buildRulesFromStrapi } from "@/app/lib/ability";
import { AbilityProvider } from "@/app/providers/ability-provider";
import { NavigationProvider } from "@/app/providers/navigation-provider";
import { QueryProvider } from "@/app/providers/query-provider";
import { UserProvider } from "@/app/providers/user-provider";
import api from "@/lib/api";
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

  const {
    data: { data: navigation },
  } = await publicApi.dashboardNavbar.getDashboardNavbar({
    populate: {
      section: {
        populate: {
          links: "*",
        },
      },
    },
  });

  if (!navigation) {
    throw new Error("Failed to load navigation");
  }

  return (
    <QueryProvider>
      <UserProvider user={user?.data}>
        <AbilityProvider rules={rules} role={role}>
          <NavigationProvider navigation={navigation}>
            <Shell>{children}</Shell>
          </NavigationProvider>
        </AbilityProvider>
      </UserProvider>
    </QueryProvider>
  );
}
