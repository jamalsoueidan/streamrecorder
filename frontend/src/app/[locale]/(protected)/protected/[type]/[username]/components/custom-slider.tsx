"use client";

import { Box, Slider } from "@mantine/core";
import { clamp, useMove } from "@mantine/hooks";
import { IconGripVertical } from "@tabler/icons-react";
import { useRef } from "react";

interface CustomSliderProps {
  duration: number;
  currentTime: number;
  startTime: number;
  endTime: number;
  onRangeChange: (start: number, end: number) => void;
  onSeek: (time: number) => void;
  formatTime: (seconds: number) => string;
}

export function CustomSlider({
  duration,
  currentTime,
  startTime,
  endTime,
  onRangeChange,
  onSeek,
  formatTime,
}: CustomSliderProps) {
  const activeGrip = useRef<"start" | "end" | "track" | null>(null);
  const dragStartX = useRef(0);
  const dragStartRange = useRef({ start: 0, end: 0 });

  // Keep refs in sync so useMove callback has fresh values
  const startTimeRef = useRef(startTime);
  const endTimeRef = useRef(endTime);
  startTimeRef.current = startTime;
  endTimeRef.current = endTime;

  const clampedTime = Math.max(startTime, Math.min(currentTime, endTime));
  const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;
  const rangeDuration = endTime - startTime;

  const handleMove = (x: number) => {
    if (!activeGrip.current) return;
    if (duration <= 0) return;

    const minGap = 15; // 15 seconds minimum

    if (activeGrip.current === "start") {
      const maxAllowed = endTimeRef.current - minGap;
      const newStart = Math.floor(clamp(x * duration, 0, maxAllowed));
      onRangeChange(newStart, endTimeRef.current);
      onSeek(newStart);
    } else if (activeGrip.current === "end") {
      const minAllowed = startTimeRef.current + minGap;
      const newEnd = Math.floor(clamp(x * duration, minAllowed, duration));
      onRangeChange(startTimeRef.current, newEnd);
      onSeek(newEnd);
    } else if (activeGrip.current === "track") {
      const delta = x - dragStartX.current;
      const deltaTime = Math.floor(delta * duration);

      let newStart = dragStartRange.current.start + deltaTime;
      let newEnd = dragStartRange.current.end + deltaTime;

      if (newStart < 0) {
        newStart = 0;
        newEnd = rangeDuration;
      }
      if (newEnd > duration) {
        newEnd = duration;
        newStart = duration - rangeDuration;
      }

      onRangeChange(newStart, newEnd);
      onSeek(newStart);
    }
  };

  const { ref: trackRef } = useMove(({ x }) => handleMove(x));

  return (
    <Box py="md">
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
          position: "relative",
          height: 50,
          background: "#333",
          cursor: "grab",
        }}
      >
        {/* Start grip - pivot on right side */}
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

        {/* Slider between grips */}
        <Box
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
            top: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
            zIndex: 5,
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
            styles={{
              thumb: {
                width: 4,
                height: 40,
                borderRadius: 2,
                border: "none",
                backgroundColor: "white",
              },
            }}
            style={{ width: "100%" }}
          />
        </Box>

        {/* End grip - pivot on left side */}
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

      <div style={{ marginTop: 10, color: "#888" }}>
        Start: {formatTime(startTime)} | End: {formatTime(endTime)} | Duration:{" "}
        {formatTime(endTime - startTime)}
      </div>
    </Box>
  );
}
