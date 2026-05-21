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

  // PandaLive URL pattern
  const pandaliveRegex =
    /(?:https?:\/\/)?(?:www\.)?pandalive\.co\.kr\/(?:live\/)?play\/([^\/\s?]+)/i;
  const pandaliveMatch = trimmed.match(pandaliveRegex);

  if (pandaliveMatch) {
    return {
      username: pandaliveMatch[1],
      platform: "pandalive",
    };
  }

  const bigoRegex =
    /(?:https?:\/\/)?(?:www\.)?bigo\.tv\/(?:[a-z]{2}\/)?(?:user\/)?([^\/\s?]+)/i;
  const bigoMatch = trimmed.match(bigoRegex);

  if (bigoMatch) {
    return {
      username: bigoMatch[1],
      platform: "bigo",
    };
  }

  // Buzzcast URL pattern
  const buzzcastRegex =
    /(?:https?:\/\/)?(?:www\.)?buzzcast\.com\/web\/personalInfo\/([^\/\s?]+)/i;
  const buzzcastMatch = trimmed.match(buzzcastRegex);

  if (buzzcastMatch) {
    return {
      username: buzzcastMatch[1],
      platform: "buzzcast",
    };
  }

  // LiveMe URL pattern
  const livemeRegex =
    /(?:https?:\/\/)?(?:www\.)?liveme\.com\/(?:[a-z]{2}\/)?u\/([^\/\s?]+)/i;
  const livemeMatch = trimmed.match(livemeRegex);

  if (livemeMatch) {
    return {
      username: livemeMatch[1],
      platform: "liveme",
    };
  }

  // Mixch URL pattern — usernames are numeric IDs, e.g. mixch.tv/u/15924967
  const mixchRegex =
    /(?:https?:\/\/)?(?:www\.)?mixch\.tv\/u\/([^\/\s?]+)/i;
  const mixchMatch = trimmed.match(mixchRegex);

  if (mixchMatch) {
    return {
      username: mixchMatch[1],
      platform: "mixch",
    };
  }

  // TwitCasting URL pattern — twitcasting.tv/{username}, also supports
  // c:username variants
  const twitcastRegex =
    /(?:https?:\/\/)?(?:www\.)?twitcasting\.tv\/(?:c:)?([^\/\s?]+)/i;
  const twitcastMatch = trimmed.match(twitcastRegex);

  if (twitcastMatch) {
    return {
      username: twitcastMatch[1],
      platform: "twitcast",
    };
  }

  // Trovo URL pattern — canonical trovo.live/s/{username}, also accepts
  // legacy trovo.live/{username}
  const trovoRegex =
    /(?:https?:\/\/)?(?:www\.)?trovo\.live\/(?:s\/)?([^\/\s?]+)/i;
  const trovoMatch = trimmed.match(trovoRegex);

  if (trovoMatch) {
    return {
      username: trovoMatch[1],
      platform: "trovo",
    };
  }

  // Joilive URL pattern — joilive.net/user/index.html?s={numericId}.
  // The `s` query param value is the username.
  const joiliveRegex =
    /(?:https?:\/\/)?(?:www\.)?joilive\.net\/user\/index\.html\?s=([^\s&#]+)/i;
  const joiliveMatch = trimmed.match(joiliveRegex);

  if (joiliveMatch) {
    return {
      username: joiliveMatch[1],
      platform: "joilive",
    };
  }

  // 17live URL patterns — 17.live/{locale}/profile/r/{userId} where locale
  // can be e.g. en-US, ja-JP. Also accepts 17.live/profile/r/{userId} without locale.
  // The enum value is "live17" because Strapi enums can't start with a digit.
  const live17Regex =
    /(?:https?:\/\/)?(?:www\.)?17\.live\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?profile\/r\/([^\/\s?]+)/i;
  const live17Match = trimmed.match(live17Regex);

  if (live17Match) {
    return {
      username: live17Match[1],
      platform: "live17",
    };
  }

  // Kwai URL patterns — kwai.com/@username (with optional locale segment, e.g.
  // kwai.com/en/@username), or kwai.com/profile/{id}.
  const kwaiRegex =
    /(?:https?:\/\/)?(?:www\.|live\.|m\.)?kwai\.com\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:@|profile\/)([^\/\s?]+)/i;
  const kwaiMatch = trimmed.match(kwaiRegex);

  if (kwaiMatch) {
    return {
      username: kwaiMatch[1],
      platform: "kwai",
    };
  }

  // Plain username - remove @ if present
  const username = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;

  return {
    username,
    platform: null,
  };
}
