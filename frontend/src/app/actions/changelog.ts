"use server";

import api from "@/lib/api";

export async function getChangeLogVersion() {
  const response = await api.changeLog.getChangeLogs({
    sort: "createdAt:desc",
    "pagination[limit]": 1,
  });

  const data = response.data.data || [];

  if (data && data.length > 0) {
    return data[0].version;
  }

  return "0.0.0";
}
