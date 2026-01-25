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
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = path.join("/");

  try {
    /*const token = await getToken();
    const isLoggedIn = !!token;
    if (!isLoggedIn) {
      return new Response("Unauthorized", { status: 401 });
    }*/
    const command = new GetObjectCommand({
      Bucket: process.env.MEDIA_BUCKET!,
      Key: filePath,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 1800 });
    return Response.redirect(signedUrl);
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return new Response("Error", { status: 500 });
  }
}
