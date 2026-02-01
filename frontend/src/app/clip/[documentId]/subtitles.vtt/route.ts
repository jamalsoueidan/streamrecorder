import publicApi from "@/lib/public-api";
import { NextRequest } from "next/server";

interface SubtitleEntry {
  text: string;
  start: number;
  end: number;
}

interface Transcript {
  text: string;
  segments: SubtitleEntry[];
}

function jsonToVtt(subtitles: SubtitleEntry[]): string {
  let vtt = "WEBVTT\n\n";

  subtitles.forEach((entry) => {
    const startTime = secondsToVtt(entry.start);
    const endTime = secondsToVtt(entry.end);

    vtt += `${startTime} --> ${endTime} line:85%\n`; // 85% from top
    vtt += `${entry.text}\n\n`;
  });

  return vtt;
}

function secondsToVtt(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(3);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${secs.padStart(6, "0")}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const locale = request.nextUrl.searchParams.get("locale") || "en";

  const { data } = await publicApi.clip.getClipsId(
    {
      id: documentId,
    },
    { query: { locale } } as any,
  );

  if (!data.data) {
    return new Response("Not found", { status: 404 });
  }

  const clip = data.data;
  const transcript = clip.transcript as Transcript | null;

  if (!transcript?.segments?.length) {
    return new Response("No subtitles available", { status: 404 });
  }

  const vttContent = jsonToVtt(transcript.segments);

  return new Response(vttContent, {
    headers: {
      "Content-Type": "text/vtt; charset=utf-8",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
