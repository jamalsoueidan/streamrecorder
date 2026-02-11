"use server";

import api from "@/lib/api";
import { deleteToken } from "@/lib/token";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateUsername(
  newUsername: string,
): Promise<ActionResult> {
  try {
    await api.user.updateUser({ username: newUsername });

    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.error?.message || "Failed to update username",
    };
  }
}

export async function deleteAccount(): Promise<ActionResult> {
  try {
    await api.user.destroyUser();
    await deleteToken();

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete account" };
  }
}
