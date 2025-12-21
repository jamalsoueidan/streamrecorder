import { getToken } from "@/lib/token";

import { redirect } from "next/navigation";
import api from "../../lib/api";

import { NavigationProvider } from "../providers/navigation-provider";
import { UserProvider } from "../providers/user-provider";
import { Shell } from "../ui/shell";

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
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles();

  const navigation = await api.navigation.getNavigation({ populate: "links" });

  return (
    <UserProvider user={user?.data}>
      <NavigationProvider navigation={navigation?.data}>
        <Shell>{children}</Shell>
      </NavigationProvider>
    </UserProvider>
  );
}
