import { S3Client } from "@aws-sdk/client-s3";

const s3Fsn1 = new S3Client({
  region: "fsn1",
  endpoint: "https://fsn1.your-objectstorage.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const s3Nbg1 = new S3Client({
  region: "nbg1",
  endpoint: "https://nbg1.your-objectstorage.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const S3_CUTOFF = new Date("2026-03-04T15:00:00Z");

export function getS3(createdAt?: Date | string | null): S3Client {
  if (!createdAt) return s3Fsn1;
  return new Date(createdAt) >= S3_CUTOFF ? s3Nbg1 : s3Fsn1;
}

export function getBucket(
  bucket: string,
  createdAt?: Date | string | null,
): string {
  if (!createdAt) return bucket;
  return new Date(createdAt) >= S3_CUTOFF ? `${bucket}-nbg` : bucket;
}
