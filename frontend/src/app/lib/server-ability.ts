import { cache } from "react";
import api from "@/lib/api";
import { buildRulesFromStrapi, createAbility } from "./ability";

export const getServerAbility = cache(async () => {
  const user =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
      populate: "role",
    });

  const role = user?.data?.role || null;

  if (!role?.id) {
    return createAbility([]);
  }

  const permissions = await api.usersPermissionsUsersRoles.rolesDetail({
    id: role.id.toString(),
  });

  const rules = buildRulesFromStrapi(
    (permissions.data?.role as any)?.permissions || {},
  );

  return createAbility(rules);
});
