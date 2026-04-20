import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

const agent = new https.Agent({
  maxSockets: 200,
  keepAlive: true,
  keepAliveMsecs: 1000,
});

export const s3Nbg1 = new S3Client({
  region: "nbg1",
  endpoint: "https://nbg1.your-objectstorage.com",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent: agent,
    connectionTimeout: 10000,
    requestTimeout: 30000,
  }),
});

const S3_CUTOFF_2 = new Date("2026-03-24T12:00:00Z");
const S3_PLATFORM_CUTOFF = new Date("2026-03-29T15:05:00Z");

const PLATFORM_BUCKETS = new Set([
  "tiktok",
  "bigo",
  "twitch",
  "kick",
  "youtube",
  "afreecatv",
  "pandalive",
  "tango",
  "buzzcast",
  "liveme",
]);

export function getS3(): S3Client {
  return s3Nbg1;
}

export function proxySignedUrl(url: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return url;
  return url.replace("nbg1.your-objectstorage.com", "media.livestreamrecorder.net");
}

export function getBucket(
  bucket: string,
  createdAt?: Date | string | null,
  path?: string | null,
  sourceBucket?: string | null,
): string {
  if (sourceBucket) return sourceBucket;

  if (!createdAt) return `${bucket}-nbg`;
  const date = new Date(createdAt);

  // New recordings go to platform-specific buckets
  if (path && date >= S3_PLATFORM_CUTOFF) {
    const platform = path.split("/").filter(Boolean)[0];
    if (platform && PLATFORM_BUCKETS.has(platform)) {
      return `${bucket}-${platform}`;
    }
  }

  if (date >= S3_CUTOFF_2) return `${bucket}-nbg1`;
  return `${bucket}-nbg`;
}
