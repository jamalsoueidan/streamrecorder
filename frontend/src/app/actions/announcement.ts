"use server";

import publicApi from "@/lib/public-api";

export async function getAnnouncement(locale: string) {
  try {
    const response = await publicApi.announcement.getAnnouncements({
      locale,
      "pagination[pageSize]": 1,
      sort: "createdAt:desc",
    } as any);

    return response.data?.data?.[0] ?? null;
  } catch {
    return null;
  }
}
