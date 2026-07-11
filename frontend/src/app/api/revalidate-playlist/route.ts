import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Called by the storage migration after it repoints a source's
// bucket/endpoint, to instantly bust the playlist.m3u8 cache for the
// affected recording(s) so playback flips to B without waiting out the
// 1h unstable_cache TTL. Worst case if hit by anyone else: a harmless
// Strapi refetch, so no auth.
export async function POST(req: NextRequest) {
  let documentIds: string[];
  try {
    const body = await req.json();
    documentIds = Array.isArray(body.documentIds)
      ? body.documentIds
      : body.documentId
        ? [body.documentId]
        : [];
  } catch {
    return new NextResponse("Bad JSON", { status: 400 });
  }

  if (!documentIds.length) {
    return new NextResponse("Missing documentId(s)", { status: 400 });
  }

  // { expire: 0 } forces immediate hard expiration (Next 16). NOT a
  // stale-while-revalidate profile like "max" — after we delete the H
  // copy the old m1 URL must never be served again.
  for (const id of documentIds) revalidateTag(`playlist-${id}`, { expire: 0 });
  return NextResponse.json({ revalidated: true, count: documentIds.length });
}
