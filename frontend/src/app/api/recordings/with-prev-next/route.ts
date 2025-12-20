import { getRecordingsWithPrevNext } from "@/app/actions/recordings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id")!;
  const sort = searchParams.get("sort") || "createdAt:desc";

  const data = await getRecordingsWithPrevNext({ id, sort });
  return NextResponse.json(data);
}
