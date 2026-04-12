import publicApi from "@/lib/public-api";
import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";

const fetchChapters = unstable_cache(
  async (documentId: string) => {
    const response = await publicApi.source.getSources({
      filters: {
        recording: { documentId },
        state: { $eq: "done" },
      },
      sort: "createdAt:asc",
      fields: ["duration", "createdAt"],
    } as any);

    return response.data.data ?? [];
  },
  ["chapters-vtt"],
  { revalidate: 3600 },
);

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const sources = await fetchChapters(documentId);

  if (!sources.length) {
    return new Response("WEBVTT\n", {
      headers: { "Content-Type": "text/vtt", "Cache-Control": "public, max-age=3600" },
    });
  }

  // Single source = no chapters needed
  if (sources.length === 1) {
    return new Response("WEBVTT\n", {
      headers: { "Content-Type": "text/vtt", "Cache-Control": "public, max-age=3600" },
    });
  }

  let vtt = "WEBVTT\n\n";
  let offset = 0;

  for (let i = 0; i < sources.length; i++) {
    const duration = sources[i].duration || 0;
    const start = formatTime(offset);
    const end = formatTime(offset + duration);
    vtt += `${start} --> ${end}\nPart ${i + 1}\n\n`;
    offset += duration;
  }

  return new Response(vtt, {
    headers: {
      "Content-Type": "text/vtt",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
