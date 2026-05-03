"use server";

import api from "@/lib/api";

export async function toggleFavorite(documentId: string, isFavorite: boolean) {
  if (isFavorite) {
    await api.follower.unfavoriteFollower({ documentId });
  } else {
    await api.follower.favoriteFollower({ documentId });
  }
}
