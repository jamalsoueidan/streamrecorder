import { getToken } from "@/lib/token";

import { redirect } from "next/navigation";
import api from "../api";
import { NavigationProvider } from "../lib/navigation-provider";
import { UserProvider } from "../lib/user-provider";
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
