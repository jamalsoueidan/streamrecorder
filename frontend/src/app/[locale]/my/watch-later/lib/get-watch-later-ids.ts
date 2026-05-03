import { cookies } from "next/headers";

const COOKIE_NAME = "watchLater";

export async function getWatchLaterIds(): Promise<string[]> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);

  if (cookie?.value) {
    try {
      return JSON.parse(decodeURIComponent(cookie.value));
    } catch {
      return [];
    }
  }
  return [];
}
