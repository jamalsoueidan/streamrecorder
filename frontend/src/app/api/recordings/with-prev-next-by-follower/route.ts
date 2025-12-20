import { getRecordingsWithPrevNextByFollower } from "@/app/actions/recordings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id")!;

  const data = await getRecordingsWithPrevNextByFollower({
    id,
  });
  return NextResponse.json(data);
}
