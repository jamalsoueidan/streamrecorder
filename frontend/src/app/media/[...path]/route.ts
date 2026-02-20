import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import { getToken } from "@/lib/token";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from "next/headers";

const s3 = new S3Client({
  region: "fsn1",
  endpoint: "https://fsn1.your-objectstorage.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const FINGERPRINT_COOKIE = "_pxvid";
const MAX_PUBLIC_VIEWS = 1; // TODO: Change to 5 for production

// Files that bypass access control (placeholders)
const PUBLIC_FILES = [
  "please-sign-in-en.mp4",
  "please-sign-in-ar.mp4",
  "please-upgrade-en.mp4",
  "please-upgrade-ar.mp4",
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = path.join("/");

  try {
    // Allow placeholder files without access control
    if (PUBLIC_FILES.includes(filePath)) {
      const command = new GetObjectCommand({
        Bucket: process.env.MEDIA_BUCKET!,
        Key: filePath,
      });
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 1800 });
      return Response.redirect(signedUrl);
    }

    // Extract source path from file path
    const pathParts = filePath.split("/");
    pathParts.pop(); // remove filename
    const sourcePath = "/" + pathParts.join("/") + "/";

    // Find the source and recording
    const { data: sourceData } = await publicApi.source.getSources({
      filters: {
        path: { $eq: sourcePath },
      },
      populate: "recording.follower",
      "pagination[limit]": 1,
    });

    const source = sourceData.data?.[0];
    const recording = source?.recording;
    const follower = recording?.follower;

    // If can't find source, deny access
    if (!source || !recording) {
      return new Response("Not found", { status: 404 });
    }

    // Check if user is logged in
    const token = await getToken();
    const isLoggedIn = !!token;

    if (isLoggedIn) {
      const user =
        await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
          populate: {
            role: true,
            followers: {
              fields: ["id"],
            },
          },
        });

      const role = user?.data?.role;
      const roleType = (role as any)?.type;
      const subscriptionStatus = (user?.data as any)?.subscriptionStatus;

      // Admin, champion, or active subscription = full access
      if (
        roleType === "admin" ||
        roleType === "champion" ||
        subscriptionStatus === "active"
      ) {
        const command = new GetObjectCommand({
          Bucket: process.env.MEDIA_BUCKET!,
          Key: filePath,
        });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 1800 });
        return Response.redirect(signedUrl);
      }

      // Basic user - check if following
      if (follower?.documentId) {
        const userFollowers = (user?.data as any)?.followers || [];
        const isFollowing = userFollowers.some(
          (f: any) => f.documentId === follower.documentId,
        );

        if (isFollowing) {
          const command = new GetObjectCommand({
            Bucket: process.env.MEDIA_BUCKET!,
            Key: filePath,
          });
          const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 1800,
          });
          return Response.redirect(signedUrl);
        }
      }

      // Basic user not following - deny
      return new Response("Forbidden", { status: 403 });
    }

    // Public user - check fingerprint
    const cookieStore = await cookies();
    const fingerprint = cookieStore.get(FINGERPRINT_COOKIE)?.value;

    if (!fingerprint) {
      // No fingerprint, allow (first visit)
      const command = new GetObjectCommand({
        Bucket: process.env.MEDIA_BUCKET!,
        Key: filePath,
      });
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 1800 });
      return Response.redirect(signedUrl);
    }

    // Check view count
    const { data: viewsData } = await publicApi.visitorView.getVisitorViews({
      filters: {
        fingerprint: { $eq: fingerprint },
      },
      populate: "recording",
      "pagination[limit]": MAX_PUBLIC_VIEWS + 1,
    });

    const viewedRecordings = new Set(
      viewsData.data?.map((v) => v.recording?.documentId).filter(Boolean),
    );

    const alreadyViewed = viewedRecordings.has(recording.documentId);

    if (alreadyViewed || viewedRecordings.size < MAX_PUBLIC_VIEWS) {
      const command = new GetObjectCommand({
        Bucket: process.env.MEDIA_BUCKET!,
        Key: filePath,
      });
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 1800 });
      return Response.redirect(signedUrl);
    }

    // Limit exceeded - deny
    return new Response("Forbidden", { status: 403 });
  } catch (error) {
    console.error("Error in media access control:", error);
    return new Response("Error", { status: 500 });
  }
}
