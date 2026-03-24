import { S3Client } from "@aws-sdk/client-s3";

export const s3Nbg1 = new S3Client({
  region: "nbg1",
  endpoint: "https://nbg1.your-objectstorage.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const S3_CUTOFF_2 = new Date("2026-03-24T12:00:00Z");

export function getS3(): S3Client {
  return s3Nbg1;
}

export function getBucket(
  bucket: string,
  createdAt?: Date | string | null,
): string {
  if (!createdAt) return `${bucket}-nbg`;
  const date = new Date(createdAt);
  if (date >= S3_CUTOFF_2) return `${bucket}-nbg1`;
  return `${bucket}-nbg`;
}
