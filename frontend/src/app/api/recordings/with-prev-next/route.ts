import { getRecordingsWithPrevNext } from "@/app/actions/recordings";
import { SortOptions } from "@/app/lib/types/filtering";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id")!;
  const sort = searchParams.get("sort") || SortOptions.createdAtDesc;

  const data = await getRecordingsWithPrevNext({ id, sort });
  return NextResponse.json(data);
}
