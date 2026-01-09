import { PlatformType } from "@/app/actions/check-user";

export interface ParsedUsername {
  username: string;
  platform: PlatformType | null;
}

export function parseUsername(input: string): ParsedUsername {
  const trimmed = input.trim();

  // TikTok URL pattern
  const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([^\/\s?]+)/i;
  const tiktokMatch = trimmed.match(tiktokRegex);

  if (tiktokMatch) {
    return {
      username: tiktokMatch[1],
      platform: "tiktok",
    };
  }

  // Twitch URL pattern
  const twitchRegex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([^\/\s?]+)/i;
  const twitchMatch = trimmed.match(twitchRegex);

  if (twitchMatch) {
    return {
      username: twitchMatch[1],
      platform: "twitch",
    };
  }

  // Kick URL pattern
  const kickRegex = /(?:https?:\/\/)?(?:www\.)?kick\.com\/([^\/\s?]+)/i;
  const kickMatch = trimmed.match(kickRegex);

  if (kickMatch) {
    return {
      username: kickMatch[1],
      platform: "kick",
    };
  }

  // YouTube URL patterns
  const youtubeHandleRegex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([^\/\s?]+)/i;
  const youtubeChannelRegex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([^\/\s?]+)/i;
  const youtubeCustomRegex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([^\/\s?]+)/i;

  const youtubeHandleMatch = trimmed.match(youtubeHandleRegex);
  if (youtubeHandleMatch) {
    return {
      username: youtubeHandleMatch[1],
      platform: "youtube",
    };
  }

  const youtubeChannelMatch = trimmed.match(youtubeChannelRegex);
  if (youtubeChannelMatch) {
    return {
      username: youtubeChannelMatch[1],
      platform: "youtube",
    };
  }

  const youtubeCustomMatch = trimmed.match(youtubeCustomRegex);
  if (youtubeCustomMatch) {
    return {
      username: youtubeCustomMatch[1],
      platform: "youtube",
    };
  }

  // AfreecaTV / SOOP URL patterns
  const afreecaRegex =
    /(?:https?:\/\/)?(?:www\.|play\.|bj\.)?(?:afreecatv\.com|sooplive\.co\.kr)\/(?:station\/)?([^\/\s?]+)/i;
  const afreecaMatch = trimmed.match(afreecaRegex);

  if (afreecaMatch) {
    return {
      username: afreecaMatch[1],
      platform: "afreecatv",
    };
  }

  // Plain username - remove @ if present
  const username = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;

  return {
    username,
    platform: null,
  };
}
