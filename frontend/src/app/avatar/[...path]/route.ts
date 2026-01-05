import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "fsn1",
  endpoint: "https://fsn1.your-objectstorage.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");

  const command = new GetObjectCommand({
    Bucket: process.env.AVATAR_BUCKET!,
    Key: filePath,
  });
  const response = await s3.send(command);

  return new Response(response.Body as ReadableStream, {
    headers: {
      "Content-Type": response.ContentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
