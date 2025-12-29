import { PlatformType } from "@/app/actions/check-user";

export interface ParsedUsername {
  username: string;
  platform: PlatformType | null; // null means couldn't detect from URL
}

/**
 * Parses a username from a URL or plain text input
 *
 * Supports:
 * - TikTok URLs: https://www.tiktok.com/@username/...
 * - Twitch URLs: https://www.twitch.tv/username/...
 * - Plain usernames (with or without @)
 */
export function parseUsername(input: string): ParsedUsername {
  const trimmed = input.trim();

  // TikTok URL pattern
  // Matches: tiktok.com/@username or www.tiktok.com/@username
  const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([^\/\s?]+)/i;
  const tiktokMatch = trimmed.match(tiktokRegex);

  if (tiktokMatch) {
    return {
      username: tiktokMatch[1],
      platform: "tiktok",
    };
  }

  // Twitch URL pattern
  // Matches: twitch.tv/username or www.twitch.tv/username
  // Captures the first path segment after the domain
  const twitchRegex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([^\/\s?]+)/i;
  const twitchMatch = trimmed.match(twitchRegex);

  if (twitchMatch) {
    return {
      username: twitchMatch[1],
      platform: "twitch",
    };
  }

  // Plain username - remove @ if present
  // Return null platform so caller uses the selected platform
  const username = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;

  return {
    username,
    platform: null,
  };
}
