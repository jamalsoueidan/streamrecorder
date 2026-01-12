/* eslint-disable @next/next/no-img-element */
import { getFollower } from "@/app/(public)/public/[type]/[username]/actions/actions";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const platformColors: Record<string, { from: string; to: string }> = {
  tiktok: { from: "#00f2ea", to: "#ff0050" },
  twitch: { from: "#9146ff", to: "#772ce8" },
  youtube: { from: "#ff0000", to: "#cc0000" },
  kick: { from: "#53fc18", to: "#45d615" },
  default: { from: "#8B5CF6", to: "#EC4899" },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; username: string }> }
) {
  const { type, username } = await params;

  const follower = await getFollower({ username, type });

  const colors = platformColors[type?.toLowerCase()] || platformColors.default;
  const displayName = follower?.nickname || username.replace("@", "");
  const avatarUrl = follower?.avatar?.url;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
        }}
      >
        {/* Main content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            gap: "60px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "280px",
              height: "280px",
              borderRadius: "140px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                width={264}
                height={264}
                alt=""
                style={{
                  borderRadius: "132px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "264px",
                  height: "264px",
                  borderRadius: "132px",
                  background: "rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "120px",
                  color: "white",
                }}
              >
                {displayName[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "600px",
            }}
          >
            {/* Platform badge */}
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "24px",
                  color: "white",
                  textTransform: "capitalize",
                  display: "flex",
                }}
              >
                {type}
              </div>
            </div>

            {/* Name */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.1,
                display: "flex",
              }}
            >
              {displayName}
            </div>

            {/* Username */}
            <div
              style={{
                fontSize: "32px",
                color: "rgba(255,255,255,0.8)",
                display: "flex",
              }}
            >
              @{username.replace("@", "")}
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.9)",
                marginTop: "12px",
                display: "flex",
              }}
            >
              {follower.tagline ||
                "Recording your live streams so you don't have to!"}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            height: "60px",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "white",
              fontSize: "24px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "6px",
                background: "#ef4444",
                display: "flex",
              }}
            />
            <span>LiveStreamRecorder</span>
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "20px",
              display: "flex",
            }}
          >
            Never miss a stream
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
