// app/clip/[documentId]/[file]/route.ts
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

const ALLOWED_EXTENSIONS = [".jpg", ".mp4", ".webp", ".gif"] as const;
type AllowedExt = (typeof ALLOWED_EXTENSIONS)[number];

function getExtension(file: string): AllowedExt | null {
  if (file.includes("..") || file.includes("/") || file.includes("\\")) {
    return null;
  }

  const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext as AllowedExt)
    ? (ext as AllowedExt)
    : null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ documentId: string; file: string }> },
) {
  const { documentId, file } = await params;

  const ext = getExtension(file);
  if (!ext) {
    return new Response("Invalid file", { status: 400 });
  }

  const { data } = await publicApi.meme.getMemesId({ id: documentId });

  if (!data.data) {
    return new Response("Not found", { status: 404 });
  }

  const clip = data.data;
  const bucket = process.env.CLIP_BUCKET!;
  const key = `${clip.path?.substring(1)}${documentId}/${file}`;
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  const abortController = new AbortController();

  try {
    // MP4 → redirect
    if (ext === ".mp4") {
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return Response.redirect(signedUrl, 302);
    }

    // Stream for images
    const response = await s3.send(command, {
      abortSignal: abortController.signal,
    });

    return new Response(response.Body as ReadableStream, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": response.ContentLength?.toString() || "",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    abortController.abort();

    if (error.Code === "NoSuchKey" || error.name === "NoSuchKey") {
      return new Response("Not found", { status: 404 });
    }

    console.error(`Error fetching ${file}:`, error);
    return new Response("Error", { status: 500 });
  }
}
