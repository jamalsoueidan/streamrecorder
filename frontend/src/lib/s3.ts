import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

// Suppress MaxListenersExceededWarning from AWS SDK S3 TLS sockets
// This is a known false positive with Node.js 20+ and AWS SDK v3
// https://github.com/aws/aws-sdk-js-v3/issues/4978
process.setMaxListeners(0);

const agent = new https.Agent({
  maxSockets: 200,
  keepAlive: true,
  keepAliveMsecs: 1000,
});

// Endpoint hostname → S3 connection config. Each source row carries its
// own `endpoint` field; this map tells us how to talk to that storage.
// New providers slot in here without schema changes.
const ENDPOINT_CONFIGS: Record<
  string,
  {
    endpoint: string;
    region: string;
    accessKey: string | undefined;
    secretKey: string | undefined;
  }
> = {
  "nbg1.your-objectstorage.com": {
    endpoint: "https://nbg1.your-objectstorage.com",
    region: "nbg1",
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
  },
  "s3.eu-central-003.backblazeb2.com": {
    endpoint:
      process.env.B2_ENDPOINT ?? "https://s3.eu-central-003.backblazeb2.com",
    region: process.env.B2_REGION ?? "eu-central-003",
    accessKey: process.env.B2_ACCESS_KEY,
    secretKey: process.env.B2_SECRET_KEY,
  },
};

const DEFAULT_ENDPOINT = "nbg1.your-objectstorage.com";

function buildClient(endpoint: string): S3Client {
  const cfg = ENDPOINT_CONFIGS[endpoint];
  if (!cfg) throw new Error(`unknown S3 endpoint: ${endpoint}`);
  if (!cfg.accessKey || !cfg.secretKey) {
    throw new Error(
      `S3 credentials missing for endpoint "${endpoint}" — check env vars are set on this deployment`,
    );
  }
  return new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: cfg.accessKey,
      secretAccessKey: cfg.secretKey,
    },
    requestHandler: new NodeHttpHandler({
      httpsAgent: agent,
      connectionTimeout: 10000,
      requestTimeout: 30000,
    }),
  });
}

const s3ClientCache = new Map<string, S3Client>();
function getCachedClient(endpoint: string): S3Client {
  let client = s3ClientCache.get(endpoint);
  if (!client) {
    client = buildClient(endpoint);
    s3ClientCache.set(endpoint, client);
  }
  return client;
}

// Backward-compatible: getS3() with no args returns the default client.
// Callers that have a Source row should pass `source.endpoint`.
export function getS3(endpoint?: string | null): S3Client {
  return getCachedClient(endpoint || DEFAULT_ENDPOINT);
}

// Lazy helper for callers that previously imported `s3Nbg1` as a module
// constant. Eager init crashed unrelated routes (e.g. VTT routes that
// don't touch S3) when env vars weren't loaded yet — make it a function
// so the client is built on first call, not on import.
export const s3Nbg1 = (): S3Client => getCachedClient(DEFAULT_ENDPOINT);

// Map every supported origin host to the public CF subdomain that fronts
// it. Each backend gets its own opaque subdomain (m1/m2) so the Worker
// decides upstream purely by hostname. The mapping isn't visible to the
// browser.
const HOST_TO_MEDIA_SUBDOMAIN: Record<string, string> = {
  "nbg1.your-objectstorage.com": "m1",
  "s3.eu-central-003.backblazeb2.com": "m2",
};

export function proxySignedUrl(url: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return url;
  const host = new URL(baseUrl).hostname.replace(/^www\./, "");
  const u = new URL(url);
  const subdomain = HOST_TO_MEDIA_SUBDOMAIN[u.hostname];
  if (!subdomain) return url;
  return url.replace(u.hostname, `${subdomain}.${host}`);
}

export function proxyClipSignedUrl(url: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return url;
  const host = new URL(baseUrl).hostname.replace(/^www\./, "");
  const u = new URL(url);
  if (!HOST_TO_MEDIA_SUBDOMAIN[u.hostname]) return url;
  u.hostname = `clip.${host}`;
  // Strip the leading `/<bucket>/` segment from the path so the public
  // clip URL doesn't leak the bucket name. Only path-segment match —
  // safer than a global string replace that could hit signed-URL query
  // params.
  const bucket = `${process.env.CLIP_BUCKET!}-nbg`;
  if (u.pathname.startsWith(`/${bucket}/`)) {
    u.pathname = u.pathname.slice(bucket.length + 1);
  }
  return u.toString();
}

export function getBucket(
  bucket: string,
  sourceBucket?: string | null,
): string {
  return sourceBucket || `${bucket}-nbg`;
}
