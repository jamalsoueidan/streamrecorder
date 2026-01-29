import publicApi from "@/lib/public-api";
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
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;

  const { data } = await publicApi.clip.getClipsId({
    id: documentId,
  });

  if (!data.data) {
    return new Response("Not found", { status: 404 });
  }

  const clip = data.data;

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CLIP_BUCKET!,
      Key: `${clip.path?.substring(1)}${documentId}/clip.mp4`,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return Response.redirect(signedUrl);
  } catch (error: any) {
    if (error.Code === "NoSuchKey" || error.name === "NoSuchKey") {
      return new Response("Not found", { status: 404 });
    }

    console.error("Error fetching clip:", error);
    return new Response("Error", { status: 500 });
  }
}
