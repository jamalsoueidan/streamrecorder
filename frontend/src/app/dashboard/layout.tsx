import { logout } from "@/app/actions/auth";
import { getToken } from "@/lib/token";
import { redirect } from "next/navigation";
import api from "../api";
import AddFollowerForm from "./add-follower-form";
import DashboardNav from "./dashboard-nav";

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

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h1>Dashboard</h1>
        <div>
          <span>Hi, {user?.data?.username}</span>
          <form action={logout} style={{ display: "inline", marginLeft: 12 }}>
            <button type="submit">Logout</button>
          </form>
        </div>
      </header>

      <AddFollowerForm />

      <DashboardNav />

      {children}
    </div>
  );
}
