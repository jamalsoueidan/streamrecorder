"use server";

import api from "@/lib/api";

export async function deleteClip(documentId: string) {
  try {
    // Get clip with localizations
    const { data } = await api.clip.getClipsId({
      id: documentId,
      populate: "localizations",
    } as never);
    const clip = data?.data;
    const localizations =
      (clip?.localizations as { locale: string }[]) || [];

    // Delete main clip (default locale)
    await api.clip.deleteClipsId({ id: documentId });

    // Delete all localizations
    await Promise.all(
      localizations.map((loc) =>
        api.clip.deleteClipsId({ id: documentId }, {
          query: { locale: loc.locale },
        } as never),
      ),
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete clip" };
  }
}
