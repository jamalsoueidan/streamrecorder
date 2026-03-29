import api from "@/lib/api";
import { FINGERPRINT_COOKIE, MAX_PUBLIC_VIEWS } from "@/lib/constants";
import publicApi from "@/lib/public-api";
import { getBucket, getS3 } from "@/lib/s3";
import { getToken } from "@/lib/token";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from "next/headers";

// Files that bypass access control (placeholders)
const PUBLIC_FILES = [
  "please-sign-in-en.mp4",
  "please-sign-in-ar.mp4",
  "please-upgrade-en.mp4",
  "please-upgrade-ar.mp4",
];

export async function GET(
  request: Request,
  _context: { params: Promise<{ path: string[] }> },
) {
  const filePath = new URL(request.url).pathname.replace(/^\/media\//, "");
  const s3Key = decodeURIComponent(filePath);

  try {
    // Allow placeholder files without access control — served from public folder
    if (PUBLIC_FILES.includes(filePath)) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${baseUrl}/videos/${filePath}`,
          "Cache-Control": "public, max-age=86400",
        },
      });
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

    const s3 = getS3();
    const mediaBucket = getBucket(process.env.MEDIA_BUCKET!, source.createdAt, source.path);

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

      // Admin, champion, or active subscription = full access
      if (
        roleType === "admin" ||
        roleType === "champion" ||
        roleType === "premium"
      ) {
        const command = new GetObjectCommand({
          Bucket: mediaBucket,
          Key: s3Key,
        });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 1800 });
        return new Response(null, {
          status: 302,
          headers: {
            Location: signedUrl,
            "Cache-Control": "no-store",
          },
        });
      }

      // Basic user - check if following
      if (follower?.documentId) {
        const userFollowers = (user?.data as any)?.followers || [];
        const isFollowing = userFollowers.some(
          (f: any) => f.documentId === follower.documentId,
        );

        if (isFollowing) {
          const command = new GetObjectCommand({
            Bucket: mediaBucket,
            Key: s3Key,
          });
          const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 1800,
          });
          return new Response(null, {
            status: 302,
            headers: {
              Location: signedUrl,
              "Cache-Control": "no-store",
            },
          });
        }
      }

      // Basic user not following - check view limit by user ID
      const userId = (user?.data as any)?.documentId;
      if (userId) {
        const userFingerprint = `user:${userId}`;

        const { data: viewsData } = await publicApi.visitorView.getVisitorViews(
          {
            filters: {
              fingerprint: { $eq: userFingerprint },
            },
            populate: "recording",
            "pagination[limit]": MAX_PUBLIC_VIEWS + 1,
          },
        );

        const viewedRecordings = new Set(
          viewsData.data?.map((v) => v.recording?.documentId).filter(Boolean),
        );

        const alreadyViewed = viewedRecordings.has(recording.documentId);

        if (alreadyViewed || viewedRecordings.size < MAX_PUBLIC_VIEWS) {
          const command = new GetObjectCommand({
            Bucket: mediaBucket,
            Key: s3Key,
          });
          const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 1800,
          });
          return new Response(null, {
            status: 302,
            headers: {
              Location: signedUrl,
              "Cache-Control": "no-store",
            },
          });
        }
      }

      // Basic user not following, limit exceeded - deny
      return new Response("Forbidden", { status: 403 });
    }

    // Public user - check fingerprint
    const cookieStore = await cookies();
    const fingerprint = cookieStore.get(FINGERPRINT_COOKIE)?.value;

    if (!fingerprint) {
      // No fingerprint, allow (first visit)
      const command = new GetObjectCommand({
        Bucket: mediaBucket,
        Key: s3Key,
      });
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 1800 });
      return new Response(null, {
        status: 302,
        headers: {
          Location: signedUrl,
          "Cache-Control": "no-store",
        },
      });
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
        Bucket: mediaBucket,
        Key: s3Key,
      });
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 1800 });
      return new Response(null, {
        status: 302,
        headers: {
          Location: signedUrl,
          "Cache-Control": "no-store",
        },
      });
    }

    // Limit exceeded - deny
    return new Response("Forbidden", { status: 403 });
  } catch (error) {
    console.error("Error in media access control:", error);
    return new Response("Error", { status: 500 });
  }
}
