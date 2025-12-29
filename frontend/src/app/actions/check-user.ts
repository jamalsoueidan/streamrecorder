"use server";

export interface UserSearchResult {
  country: string;
  countryCode: string;
  language: string;
  languageCode: string;
  avatar: string;
  nickname: string;
  username: string;
  type: string;
}

export type PlatformType = "tiktok" | "twitch";

interface CheckUserResponse {
  success: boolean;
  user?: UserSearchResult;
  error?: string;
}

export async function checkUser(
  username: string,
  type: PlatformType
): Promise<CheckUserResponse> {
  if (!username || username.trim().length === 0) {
    return { success: false, error: "Username is required" };
  }

  try {
    const response = await fetch(
      "https://n8n.tiktokrecorder.com/webhook/check-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          type: type,
        }),
      }
    );

    if (!response.ok) {
      return { success: false, error: "User not found" };
    }

    const data = await response.json();

    // Handle case where API returns empty or invalid data
    if (!data || !data.username) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user: data as UserSearchResult };
  } catch (error) {
    console.error("Error checking user:", error);
    return { success: false, error: "Failed to search for user" };
  }
}
