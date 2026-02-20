import publicApi from "@/lib/public-api";

// Get role ID by name from Strapi
export async function getRoleIdByName(name: string): Promise<number | null> {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.rolesList();
    const roles = response.data?.roles;
    const role = roles?.find(
      (r: { name?: string }) => r.name?.toLowerCase() === name.toLowerCase(),
    );
    return role?.id || null;
  } catch (error) {
    console.error("Failed to fetch role:", error);
    return null;
  }
}

// Find user by Freemius user ID
export async function findUserByFreemiusUserId(freemiusUserId: string) {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.usersList({
      query: {
        filters: {
          freemius: {
            $contains: `"userId":${JSON.stringify(freemiusUserId)}`,
          },
        },
      },
    } as never);

    const users = response.data;
    return users[0] || null;
  } catch (error) {
    console.error("Failed to find user:", error);
    return null;
  }
}

// Find user by email
export async function findUserByEmail(email: string) {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.usersList({
      query: {
        filters: {
          email: {
            $eqi: email,
          },
        },
      },
    } as never);

    const users = response.data;
    return users[0] || null;
  } catch (error) {
    console.error("Failed to find user by email:", error);
    return null;
  }
}

// Check if subscription is already claimed by another user
export async function isSubscriptionClaimed(
  subscriptionId: string,
  excludeUserId?: number,
): Promise<boolean> {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.usersList({
      query: {
        filters: {
          freemius: {
            $contains: `"subscriptionId":${JSON.stringify(subscriptionId)}`,
          },
          ...(excludeUserId && {
            id: {
              $ne: excludeUserId,
            },
          }),
        },
      },
    } as never);

    const users = response.data;
    return users && users.length > 0;
  } catch (error) {
    console.error("Failed to check subscription claim:", error);
    return false;
  }
}

// Check if license is already claimed by another user
export async function isLicenseClaimed(
  licenseId: string,
  excludeUserId?: number,
): Promise<boolean> {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.usersList({
      query: {
        filters: {
          freemius: {
            $contains: `"licenseId":${JSON.stringify(licenseId)}`,
          },
          ...(excludeUserId && {
            id: {
              $ne: excludeUserId,
            },
          }),
        },
      },
    } as never);

    const users = response.data;
    return users && users.length > 0;
  } catch (error) {
    console.error("Failed to check license claim:", error);
    return false;
  }
}

// Get billing period string from billing cycle number
// Note: Freemius lifetime purchases don't set billing_cycle, so default to "lifetime"
export function getBillingPeriod(billingCycle: number): string {
  switch (billingCycle) {
    case 1:
      return "monthly";
    case 12:
      return "annual";
    default:
      return "lifetime";
  }
}

// Update user subscription data
export interface SubscriptionUpdate {
  role?: number;
  subscriptionStatus?: "active" | "cancelled" | "expired";
  subscriptionEndDate?: string | null;
  billingPeriod?: string | null;
  paymentProvider?: "freemius" | "stripe";
  freemius?: string;
}

export async function updateUserSubscription(
  strapiUserId: string,
  data: SubscriptionUpdate,
) {
  try {
    const response = await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: strapiUserId },
      data as never,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    return null;
  }
}
