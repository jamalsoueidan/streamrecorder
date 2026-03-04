"use server";

import api from "@/lib/api";

export async function unpauseFollowers() {
  await api.follower.unpauseMyFollowers();
}
