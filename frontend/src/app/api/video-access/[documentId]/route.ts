import api from "@/lib/api";
import { FINGERPRINT_COOKIE, MAX_PUBLIC_VIEWS } from "@/lib/constants";
import publicApi from "@/lib/public-api";
import { getToken } from "@/lib/token";
import { signViewToken } from "@/lib/view-token";
import { unstable_cache } from "next/cache";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const VIEW_SESSION_COOKIE = "view_session";
const VIEW_SESSION_TTL = 60 * 30; // 30 minutes — covers a scroll session

const getFollowerForRecording = unstable_cache(
  async (documentId: string) => {
    const response = await publicApi.recording.getRecordings({
      filters: { documentId: { $eq: documentId } },
      populate: { follower: { fields: ["documentId"] } },
      "pagination[limit]": 1,
    });
    return response.data.data?.[0]?.follower?.documentId ?? null;
  },
  ["recording-follower"],
  { revalidate: 3600 },
);

type AccessResult =
  | { allowed: true; subject: string }
  | { allowed: false; reason: "sign-in" | "upgrade" };

async function resolveAccess(
  recordingDocumentId: string,
  followerDocumentId: string | null,
  ip: string | null,
): Promise<AccessResult> {
  const token = await getToken();
  const isLoggedIn = !!token;

  if (isLoggedIn) {
    const user =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({
        populate: {
          role: true,
          followers: { fields: ["documentId"] },
        },
      });

    const role = user?.data?.role;
    const roleType = (role as any)?.type;
    const userId = (user?.data as any)?.documentId;
    const userNumericId = (user?.data as any)?.id;
    const userFingerprint = `user:${userId ?? "anon"}`;

    const logView = async () => {
      if (!userId) return;
      try {
        await publicApi.visitorView.postVisitorViews({
          data: {
            fingerprint: userFingerprint,
            ip,
            recording: recordingDocumentId,
            user: userNumericId,
          } as never,
        });
      } catch (err) {
        console.error("[video-access] logView failed:", err);
      }
    };

    if (
      roleType === "admin" ||
      roleType === "champion" ||
      roleType === "premium"
    ) {
      await logView();
      return { allowed: true, subject: userFingerprint };
    }

    if (followerDocumentId) {
      const userFollowers = (user?.data as any)?.followers || [];
      const isFollowing = userFollowers.some(
        (f: any) => f.documentId === followerDocumentId,
      );
      if (isFollowing) {
        await logView();
        return { allowed: true, subject: userFingerprint };
      }
    }

    if (!userId) {
      return { allowed: false, reason: "upgrade" };
    }

    const { data: viewsData } = await publicApi.visitorView.getVisitorViews({
      filters: { fingerprint: { $eq: userFingerprint } },
      populate: "recording",
      "pagination[limit]": MAX_PUBLIC_VIEWS + 1,
    });

    const viewedRecordings = new Set(
      viewsData.data?.map((v) => v.recording?.documentId).filter(Boolean),
    );
    const alreadyViewed = viewedRecordings.has(recordingDocumentId);

    if (alreadyViewed) {
      return { allowed: true, subject: userFingerprint };
    }

    if (viewedRecordings.size >= MAX_PUBLIC_VIEWS) {
      return { allowed: false, reason: "upgrade" };
    }

    await publicApi.visitorView.postVisitorViews({
      data: {
        fingerprint: userFingerprint,
        ip,
        recording: recordingDocumentId,
        user: userNumericId,
      } as never,
    });

    return { allowed: true, subject: userFingerprint };
  }

  // Anonymous user
  const cookieStore = await cookies();
  const fingerprint = cookieStore.get(FINGERPRINT_COOKIE)?.value;

  if (!fingerprint) {
    // No fingerprint yet — allow (the client will set one and retry on next video)
    return { allowed: true, subject: "anon:no-fp" };
  }

  const { data: viewsData } = await publicApi.visitorView.getVisitorViews({
    filters: { fingerprint: { $eq: fingerprint } },
    populate: "recording",
    "pagination[limit]": MAX_PUBLIC_VIEWS + 1,
  });

  const viewedRecordings = new Set(
    viewsData.data?.map((v) => v.recording?.documentId).filter(Boolean),
  );
  const alreadyViewed = viewedRecordings.has(recordingDocumentId);

  if (alreadyViewed) {
    return { allowed: true, subject: `fp:${fingerprint}` };
  }

  if (viewedRecordings.size >= MAX_PUBLIC_VIEWS) {
    return { allowed: false, reason: "sign-in" };
  }

  await publicApi.visitorView.postVisitorViews({
    data: { fingerprint, ip, recording: recordingDocumentId } as never,
  });

  return { allowed: true, subject: `fp:${fingerprint}` };
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;

  const followerDocumentId = await getFollowerForRecording(documentId);
  if (followerDocumentId === null) {
    return NextResponse.json({ allowed: false, reason: "not-found" }, { status: 404 });
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null;

  const result = await resolveAccess(documentId, followerDocumentId, ip);

  if (!result.allowed) {
    return NextResponse.json(
      { allowed: false, reason: result.reason },
      { status: 200 },
    );
  }

  const token = signViewToken(result.subject, VIEW_SESSION_TTL);
  const response = NextResponse.json({ allowed: true });
  response.cookies.set(VIEW_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: VIEW_SESSION_TTL,
    path: "/",
  });
  return response;
}
