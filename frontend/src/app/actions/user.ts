import api from "@/lib/api";
import { cache } from "react";

export const getUser = cache(() =>
  api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
    populate: {
      role: true,
      followers: {
        fields: ["id", "documentId"],
      },
    },
  }),
);
