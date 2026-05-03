"use client";

import { Box, RangeSlider, Slider } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";

interface ThumbnailCue {
  start: number;
  end: number;
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface CustomSliderProps {
  duration: number;
  currentTime: number;
  startTime: number;
  endTime: number;
  maxRange?: number;
  onRangeChange: (start: number, end: number) => void;
  onSeek: (time: number) => void;
  formatTime: (seconds: number) => string;
  vttUrl?: string;
}

function parseVTTTime(time: string): number {
  const parts = time.split(":");
  if (parts.length === 2) {
    const [sec, ms] = parts[1].split(".");
    return parseInt(parts[0]) * 60 + parseInt(sec) + parseInt(ms) / 1000;
  }
  const [sec, ms] = parts[2].split(".");
  return (
    parseInt(parts[0]) * 3600 +
    parseInt(parts[1]) * 60 +
    parseInt(sec) +
    parseInt(ms) / 1000
  );
}

function parseVTT(vttText: string): ThumbnailCue[] {
  const cues: ThumbnailCue[] = [];
  const lines = vttText.trim().split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("-->")) {
      const [startStr, endStr] = line.split("-->").map((s) => s.trim());
      const start = parseVTTTime(startStr);
      const end = parseVTTTime(endStr);
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.includes("#xywh=")) {
        const [url, fragment] = nextLine.split("#xywh=");
        const [x, y, w, h] = fragment.split(",").map(Number);
        cues.push({ start, end, url: url.trim(), x, y, w, h });
      }
    }
  }
  return cues;
}

const TRACK_HEIGHT = 120;

export function CustomSlider({
  duration,
  currentTime,
  startTime,
  endTime,
  maxRange,
  onRangeChange,
  onSeek,
  formatTime,
  vttUrl,
}: CustomSliderProps) {
  const [thumbnailCues, setThumbnailCues] = useState<ThumbnailCue[]>([]);
  const [trackWidth, setTrackWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setTrackWidth(entry.contentRect.width));
    observer.observe(el);
    setTrackWidth(el.offsetWidth);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!vttUrl) return;
    fetch(vttUrl)
      .then((res) => res.text())
      .then((text) => setThumbnailCues(parseVTT(text)))
      .catch(() => {});
  }, [vttUrl]);

  const spriteMeta = useMemo(() => {
    const meta = new Map<string, { cols: number; rows: number }>();
    for (const cue of thumbnailCues) {
      const col = Math.floor(cue.x / cue.w) + 1;
      const row = Math.floor(cue.y / cue.h) + 1;
      const existing = meta.get(cue.url) || { cols: 0, rows: 0 };
      meta.set(cue.url, {
        cols: Math.max(existing.cols, col),
        rows: Math.max(existing.rows, row),
      });
    }
    return meta;
  }, [thumbnailCues]);

  const vttDuration = thumbnailCues.length > 0 ? thumbnailCues[thumbnailCues.length - 1].end : duration;
  const startPct = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPct = duration > 0 ? (endTime / duration) * 100 : 100;

  const rangeSize = endTime - startTime;
  const rangeMid = startTime + rangeSize / 2;
  const scrollMin = Math.round(rangeSize / 2);
  const scrollMax = Math.round(duration - rangeSize / 2);

  const handleScroll = (mid: number) => {
    const newStart = Math.max(0, Math.round(mid - rangeSize / 2));
    const newEnd = Math.min(duration, newStart + rangeSize);
    onRangeChange(newStart, newEnd);
  };

  return (
    <Box pt="md" pb={8}>
      {/* Position scroll bar - above */}
      {duration > 0 && scrollMax > scrollMin && (
        <Slider
          value={Math.round(rangeMid)}
          onChange={handleScroll}
          min={scrollMin}
          max={scrollMax}
          step={1}
          label={null}
          size={12}
          mb={8}
          styles={{
            track: {
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "transparent",
            },
            bar: { display: "none" },
            thumb: {
              height: 16,
              borderRadius: 6,
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              border: "1px solid rgba(59, 130, 246, 0.8)",
            },
          }}
        />
      )}

      {/* Thumbnails with overlays */}
      <Box
        ref={containerRef}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const time = Math.min(Math.round(x * duration), duration - 1);
          onSeek(time);
        }}
        style={{
          position: "relative",
          height: TRACK_HEIGHT,
          borderRadius: 6,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <Box style={{ position: "absolute", inset: 0, background: "#333", display: "flex" }}>
          {(() => {
            if (thumbnailCues.length === 0) return [];
            const cellW = Math.round((thumbnailCues[0].w / thumbnailCues[0].h) * TRACK_HEIGHT);
            const maxVisible = trackWidth > 0 ? Math.max(1, Math.floor(trackWidth / cellW)) : thumbnailCues.length;
            if (thumbnailCues.length <= maxVisible) return thumbnailCues;
            // Sample but keep time proportions by merging adjacent cues
            const step = Math.ceil(thumbnailCues.length / maxVisible);
            const sampled: typeof thumbnailCues = [];
            for (let j = 0; j < thumbnailCues.length; j += step) {
              const last = Math.min(j + step - 1, thumbnailCues.length - 1);
              sampled.push({ ...thumbnailCues[j], end: thumbnailCues[last].end });
            }
            // Ensure last cue covers to the end
            if (sampled.length > 0) {
              sampled[sampled.length - 1].end = thumbnailCues[thumbnailCues.length - 1].end;
            }
            return sampled;
          })().map((cue, i) => {
            const meta = spriteMeta.get(cue.url) || { cols: 2, rows: 2 };
            // Clamp to last valid cell in cols×rows grid (workflow uses cols×cols tile).
            const totalCells = meta.cols * meta.cols; // sprite is always cols×cols from ffmpeg tile
            const cellIndex = Math.floor(cue.y / cue.h) * meta.cols + Math.floor(cue.x / cue.w);
            const clampedIndex = Math.min(cellIndex, totalCells - 1);
            const clampedCol = clampedIndex % meta.cols;
            const clampedRow = Math.floor(clampedIndex / meta.cols);
            const clampedX = clampedCol * cue.w;
            const clampedY = clampedRow * cue.h;
            const scale = TRACK_HEIGHT / cue.h;
            const cellW = Math.round(cue.w * scale);
            const cueDuration = cue.end - cue.start;
            const flexGrow = vttDuration > 0 ? cueDuration / vttDuration : 1;
            const cueWidthEst = Math.round(flexGrow * trackWidth);
            const repeats = cueWidthEst > cellW ? Math.ceil(cueWidthEst / cellW) + 1 : 1;
            return (
              <div
                key={`thumb-${i}`}
                style={{
                  flex: `${flexGrow} 0 0px`,
                  height: TRACK_HEIGHT,
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                {Array.from({ length: repeats }).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      width: cellW,
                      flexShrink: 0,
                      height: TRACK_HEIGHT,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cue.url}
                      alt=""
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        transform: `scale(${scale}) translate(${-clampedX}px, ${-clampedY}px)`,
                        transformOrigin: "0 0",
                        maxWidth: "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </Box>


        <Box
          style={{
            position: "absolute",
            left: `${startPct}%`,
            width: `${endPct - startPct}%`,
            top: 0,
            height: "100%",
            border: "2px solid #3b82f6",
            borderRadius: 2,
            pointerEvents: "none",
          }}
        />

        {/* Playhead line */}
        {duration > 0 && (
          <Box
            style={{
              position: "absolute",
              left: `${(currentTime / duration) * 100}%`,
              top: 0,
              width: 2,
              height: "100%",
              backgroundColor: "white",
              pointerEvents: "none",
              zIndex: 3,
              transition: "left 0.1s linear",
            }}
          />
        )}

        <Box
          style={{
            position: "absolute",
            bottom: 4,
            left: `${(startPct + endPct) / 2}%`,
            transform: "translateX(-50%)",
            fontSize: 12,
            color: "rgba(255,255,255,0.8)",
            whiteSpace: "nowrap",
            fontWeight: 600,
            pointerEvents: "none",
            background: "rgba(0,0,0,0.5)",
            padding: "1px 6px",
            borderRadius: 4,
          }}
        >
          {formatTime(endTime - startTime)}
        </Box>
      </Box>

      {/* Range slider - overlapping bottom of thumbnails */}
      <RangeSlider
        min={0}
        max={duration || 1}
        step={1}
        value={[startTime, endTime]}
        onChange={([s, e]) => {
          onRangeChange(s, e);
          if (currentTime < s) onSeek(s);
          else if (currentTime > e) onSeek(e - 1);
        }}
        maxRange={maxRange}
        minRange={1}
        label={formatTime}
        thumbSize={24}
        mt={-10}
        style={{ position: "relative", zIndex: 25 }}
      />

    </Box>
  );
}
