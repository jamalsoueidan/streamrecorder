// Browser MSE codec detection. Used to diagnose "video failed to load"
// errors from end users.
//
// Two known classes of issue:
//   1. HEVC video (only TikTok records as HEVC after the H.264 corruption
//      fix). Most Chrome on Windows/Linux + all Firefox can't decode it
//      without the OS HEVC extension.
//   2. HE-AACv2 audio (Bigo + LiveMe). MSE support for the PS-stereo
//      profile (mp4a.40.29) is uneven — Firefox often fails, some
//      Chromium variants too. The video works, but the audio init
//      crashes the player a few seconds in.
//
// Codec map per platform was ground-truthed by probing one fresh
// recording per platform on 2026-05-10. Re-probe periodically — if a
// platform changes its encoder defaults, this table goes stale.

export interface CodecCapabilities {
  hasMSE: boolean;
  // Video
  h264: boolean;
  hevc: boolean;
  hevcMain10: boolean;
  av1: boolean;
  vp9: boolean;
  // Audio
  aacLc: boolean;
  aacHeV1: boolean;
  aacHeV2: boolean;
  opus: boolean;
  flac: boolean;
}

const CODEC_TYPES = {
  h264: 'video/mp4; codecs="avc1.640028"', // High profile, level 4.0
  hevc: 'video/mp4; codecs="hev1.1.6.L120.B0"', // Main profile, level 4.0
  hevcMain10: 'video/mp4; codecs="hev1.2.4.L120.B0"', // Main10
  av1: 'video/mp4; codecs="av01.0.05M.08"',
  vp9: 'video/mp4; codecs="vp09.00.50.08"',
  aacLc: 'audio/mp4; codecs="mp4a.40.2"',
  aacHeV1: 'audio/mp4; codecs="mp4a.40.5"',
  aacHeV2: 'audio/mp4; codecs="mp4a.40.29"',
  opus: 'audio/mp4; codecs="opus"',
  flac: 'audio/mp4; codecs="flac"',
} as const;

export function detectCodecCapabilities(): CodecCapabilities {
  if (typeof window === "undefined" || typeof MediaSource === "undefined") {
    return {
      hasMSE: false,
      h264: false,
      hevc: false,
      hevcMain10: false,
      av1: false,
      vp9: false,
      aacLc: false,
      aacHeV1: false,
      aacHeV2: false,
      opus: false,
      flac: false,
    };
  }
  return {
    hasMSE: true,
    h264: MediaSource.isTypeSupported(CODEC_TYPES.h264),
    hevc: MediaSource.isTypeSupported(CODEC_TYPES.hevc),
    hevcMain10: MediaSource.isTypeSupported(CODEC_TYPES.hevcMain10),
    av1: MediaSource.isTypeSupported(CODEC_TYPES.av1),
    vp9: MediaSource.isTypeSupported(CODEC_TYPES.vp9),
    aacLc: MediaSource.isTypeSupported(CODEC_TYPES.aacLc),
    aacHeV1: MediaSource.isTypeSupported(CODEC_TYPES.aacHeV1),
    aacHeV2: MediaSource.isTypeSupported(CODEC_TYPES.aacHeV2),
    opus: MediaSource.isTypeSupported(CODEC_TYPES.opus),
    flac: MediaSource.isTypeSupported(CODEC_TYPES.flac),
  };
}

// Per-platform expected codec mix. Ground-truthed 2026-05-10 by
// downloading one recent recording per platform and ffprobing it.
// Re-probe if a platform changes its encoder defaults.
export type VideoCodec = "h264" | "hevc";
export type AudioCodec = "aacLc" | "aacHeV1" | "aacHeV2";

interface PlatformCodecs {
  video: VideoCodec;
  audio: AudioCodec;
}

export const PLATFORM_CODECS: Record<string, PlatformCodecs> = {
  tiktok: { video: "hevc", audio: "aacHeV1" },
  bigo: { video: "h264", audio: "aacHeV2" },
  liveme: { video: "h264", audio: "aacHeV2" },
  afreecatv: { video: "h264", audio: "aacLc" },
  buzzcast: { video: "h264", audio: "aacLc" },
  kick: { video: "h264", audio: "aacLc" },
  mixch: { video: "h264", audio: "aacLc" },
  pandalive: { video: "h264", audio: "aacLc" },
  tango: { video: "h264", audio: "aacLc" },
  trovo: { video: "h264", audio: "aacLc" },
  joilive: { video: "h264", audio: "aacLc" },
  twitcast: { video: "h264", audio: "aacLc" },
  twitch: { video: "h264", audio: "aacLc" },
  youtube: { video: "h264", audio: "aacLc" },
};

export type CodecIssue = "hevc" | "aacHeV2" | "aacHeV1" | "unknown";

// Given the platform of the failing recording + the browser's
// capabilities, return which codec is missing (if any). Returns
// "unknown" when we have no info, "null" when the recording's expected
// codecs are all supported (so the failure has another cause).
export function diagnoseCodecIssue(
  platform: string | undefined,
  caps: CodecCapabilities,
  errorCode: number | null | undefined,
): CodecIssue | null {
  // Only diagnose decode/format errors. Network errors etc. aren't codec.
  if (errorCode !== 3 && errorCode !== 4) return null;
  if (!caps.hasMSE) return "unknown";

  if (!platform) return "unknown";
  const expected = PLATFORM_CODECS[platform];
  if (!expected) return "unknown";

  // Video first (more common cause)
  if (expected.video === "hevc" && !caps.hevc && !caps.hevcMain10) {
    return "hevc";
  }

  // Audio
  if (expected.audio === "aacHeV2" && !caps.aacHeV2) return "aacHeV2";
  if (expected.audio === "aacHeV1" && !caps.aacHeV1) return "aacHeV1";

  // Recording's expected codecs are all supported — issue is elsewhere
  // (network, signed URL expiry, manifest, etc.)
  return null;
}
