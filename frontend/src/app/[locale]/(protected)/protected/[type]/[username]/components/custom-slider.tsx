"use client";

import { Box, Slider } from "@mantine/core";
import { clamp, useMove } from "@mantine/hooks";
import { IconGripVertical } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

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
  onRangeChange: (start: number, end: number) => void;
  onSeek: (time: number) => void;
  formatTime: (seconds: number) => string;
  vttUrl?: string;
}

function parseVTTTime(time: string): number {
  const parts = time.split(":");
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

export function CustomSlider({
  duration,
  currentTime,
  startTime,
  endTime,
  onRangeChange,
  onSeek,
  formatTime,
  vttUrl,
}: CustomSliderProps) {
  const [thumbnailCues, setThumbnailCues] = useState<ThumbnailCue[]>([]);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch and parse VTT
  useEffect(() => {
    if (!vttUrl) return;
    fetch(vttUrl)
      .then((res) => res.text())
      .then((text) => setThumbnailCues(parseVTT(text)))
      .catch(() => {});
  }, [vttUrl]);

  // Track container width for responsive thumbnails
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => setContainerWidth(container.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const activeGrip = useRef<"start" | "end" | "track" | null>(null);
  const dragStartX = useRef(0);
  const dragStartRange = useRef({ start: 0, end: 0 });

  // Keep refs in sync via useEffect
  const startTimeRef = useRef(startTime);
  const endTimeRef = useRef(endTime);
  useEffect(() => {
    startTimeRef.current = startTime;
    endTimeRef.current = endTime;
  }, [startTime, endTime]);

  const clampedTime = Math.max(startTime, Math.min(currentTime, endTime));
  const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;

  // Thumbnail display size (half of 160x284)
  const thumbDisplayWidth = 80;
  const thumbDisplayHeight = 142;

  // Group cues by sprite URL and calculate cols per sprite
  // NOTE: Sprite is always cols x cols (square grid)
  const spriteCols = new Map<string, number>();
  for (const cue of thumbnailCues) {
    const col = Math.floor(cue.x / cue.w) + 1;
    const existing = spriteCols.get(cue.url) || 0;
    spriteCols.set(cue.url, Math.max(existing, col));
  }

  const handleMove = (x: number) => {
    if (!activeGrip.current) return;
    if (duration <= 0) return;

    if (activeGrip.current === "start") {
      const newStart = Math.floor(clamp(x * duration, 0, endTimeRef.current - 1));
      onRangeChange(newStart, endTimeRef.current);
      onSeek(newStart);
    } else if (activeGrip.current === "end") {
      const newEnd = Math.floor(clamp(x * duration, startTimeRef.current + 1, duration));
      onRangeChange(startTimeRef.current, newEnd);
    } else if (activeGrip.current === "track") {
      const delta = x - dragStartX.current;
      const deltaTime = Math.floor(delta * duration);

      let newStart = dragStartRange.current.start + deltaTime;
      let newEnd = dragStartRange.current.end + deltaTime;
      const range = dragStartRange.current.end - dragStartRange.current.start;

      if (newStart < 0) {
        newStart = 0;
        newEnd = range;
      }
      if (newEnd > duration) {
        newEnd = duration;
        newStart = duration - range;
      }

      onRangeChange(newStart, newEnd);
      onSeek(newStart);
    }
  };

  const { ref: trackRef } = useMove(({ x }) => handleMove(x));

  return (
    <Box py="md" px={20}>
      {/* Outer container for positioning */}
      <Box ref={containerRef} style={{ position: "relative", height: 142 }}>
        {/* Thumbnail filmstrip background - full width */}
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: -20,
            right: -20,
            height: "100%",
            background: "#333",
            overflow: "hidden",
            borderRadius: 6,
            display: "flex",
          }}
        >
          {thumbnailCues.length > 0 &&
            duration > 0 &&
            (() => {
              // Calculate how many thumbnails needed to fill width (add 1 for safety)
              const numThumbs =
                Math.ceil(containerWidth / thumbDisplayWidth) + 1;
              // Sample cues evenly across timeline
              const sampledCues: ThumbnailCue[] = [];
              for (let i = 0; i < numThumbs; i++) {
                const time = (i / numThumbs) * duration;
                const cue =
                  thumbnailCues.find((c) => time >= c.start && time < c.end) ||
                  thumbnailCues[0];
                sampledCues.push(cue);
              }

              return sampledCues.map((cue, i) => {
                const scale = thumbDisplayHeight / cue.h;
                const cols = spriteCols.get(cue.url) || 10;

                return (
                  <Box
                    key={`thumb-${i}`}
                    style={{
                      width: thumbDisplayWidth,
                      height: thumbDisplayHeight,
                      flexShrink: 0,
                      overflow: "hidden",
                      backgroundImage: `url(${cue.url})`,
                      backgroundSize: `${cols * thumbDisplayWidth}px ${cols * thumbDisplayHeight}px`,
                      backgroundPosition: `${-cue.x * scale}px ${-cue.y * scale}px`,
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                );
              });
            })()}
        </Box>

        {/* Overlay for excluded area - before start */}
        {startPercent > 0 && (
          <Box
            style={{
              position: "absolute",
              left: -20,
              top: 0,
              width: `calc(${startPercent}% + 20px)`,
              height: "100%",
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "6px 0 0 6px",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}

        {/* Overlay for excluded area - after end */}
        {endPercent < 100 && (
          <Box
            style={{
              position: "absolute",
              left: `${endPercent}%`,
              top: 0,
              width: `calc(${100 - endPercent}% + 20px)`,
              height: "100%",
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "0 6px 6px 0",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}

        {/* Track with useMove - for grips and range dragging */}
        <Box
          ref={trackRef}
          onMouseDown={(e) => {
            if (activeGrip.current === null) {
              const rect = e.currentTarget.getBoundingClientRect();
              dragStartX.current = (e.clientX - rect.left) / rect.width;
              dragStartRange.current = { start: startTime, end: endTime };
              activeGrip.current = "track";
            }
          }}
          onMouseUp={() => {
            activeGrip.current = null;
          }}
          style={{
            position: "absolute",
            inset: 0,
            cursor: "grab",
          }}
        >
          {/* Start grip - extends LEFT into overlay */}
          <Box
            onMouseDown={() => {
              activeGrip.current = "start";
            }}
            style={{
              position: "absolute",
              left: `${startPercent}%`,
              top: 0,
              transform: "translateX(-100%)",
              width: 20,
              height: "100%",
              background: "#3b82f6",
              cursor: "ew-resize",
              zIndex: 10,
              borderRadius: "6px 0 0 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconGripVertical size={14} color="white" />
          </Box>

          {/* End grip - extends RIGHT into overlay */}
          <Box
            onMouseDown={() => {
              activeGrip.current = "end";
            }}
            style={{
              position: "absolute",
              left: `${endPercent}%`,
              top: 0,
              width: 20,
              height: "100%",
              background: "#3b82f6",
              cursor: "ew-resize",
              zIndex: 10,
              borderRadius: "0 6px 6px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconGripVertical size={14} color="white" />
          </Box>
        </Box>

        {/* Slider - spans from start to end */}
        <Box
          style={{
            position: "absolute",
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
            top: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
            zIndex: 15,
            pointerEvents: "auto",
          }}
        >
          <Slider
            value={clampedTime}
            onChange={onSeek}
            min={startTime}
            max={endTime || 1}
            step={1}
            label={formatTime}
            size={3}
            thumbSize={20}
            labelAlwaysOn
            radius={0}
            styles={{
              root: { padding: 0 },
              track: {
                margin: 0,
                height: 142,
                "--track-bg": "transparent",
                "--slider-track-bg": "transparent",
              },
              bar: { backgroundColor: "transparent" },
              thumb: {
                width: 1,
                height: 142,
                borderRadius: 0,
                border: "none",
                backgroundColor: "white",
              },
            }}
            style={{ width: "100%" }}
          />
        </Box>
      </Box>

      <div style={{ marginTop: 10, color: "#888" }}>
        Start: {formatTime(startTime)} | End: {formatTime(endTime)} | Duration:{" "}
        {formatTime(endTime - startTime)}
      </div>
    </Box>
  );
}
