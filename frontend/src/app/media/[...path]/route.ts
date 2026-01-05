import { getToken } from "@/lib/token";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "fsn1",
  endpoint: "https://fsn1.your-objectstorage.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");
  const isVideo = /\.(mp4|webm|mov|avi|mkv)$/i.test(filePath);

  if (isVideo) {
    const token = await getToken();
    const isLoggedIn = !!token;
    if (!isLoggedIn) {
      return new Response("Unauthorized", { status: 401 });
    }
    const command = new GetObjectCommand({
      Bucket: process.env.MEDIA_BUCKET!,
      Key: filePath,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return Response.redirect(signedUrl);
  } else {
    const command = new GetObjectCommand({
      Bucket: process.env.MEDIA_BUCKET!,
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
}
