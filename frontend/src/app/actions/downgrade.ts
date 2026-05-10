"use server";

import api from "@/lib/api";
import publicApi from "@/lib/public-api";

export async function downgradeToFree() {
  // Get current user with followers
  const { data: user } =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
      populate: {
        role: true,
        followers: {
          fields: ["username", "type"],
        },
      },
    });

  if (!user || !user.id) {
    return { error: "Not eligible for downgrade" };
  }

  if (user.role?.type !== "premium") {
    return { error: "Not a premium user" };
  }

  // Allow downgrade when:
  //   - subscription is already expired (original flow), OR
  //   - user is on Freemius (we're forcing them off because Freemius
  //     terminated us — they're still "active" but soon to be refunded)
  const isExpired = user.subscriptionStatus === "expired";
  const isFreemius = user.paymentProvider === "freemius";
  if (!isExpired && !isFreemius) {
    return { error: "Not eligible for downgrade" };
  }

  // Unfollow all followers
  const followers = user.followers || [];
  for (const follower of followers) {
    try {
      await api.follower.unfollowCreate({
        username: follower.username!,
        type: follower.type as any,
      });
    } catch {
      // ignore individual unfollow errors
    }
  }

  // Update user role to authenticated using admin API
  const authenticatedRole =
    await publicApi.usersPermissionsUsersRoles.rolesList();
  const authRole = (authenticatedRole.data as any)?.roles?.find(
    (r: any) => r.type === "authenticated",
  );

  if (authRole) {
    await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: String(user.id) },
      {
        role: authRole.id,
        subscriptionStatus: null as any,
      } as any,
    );
  }

  return { success: true };
}
