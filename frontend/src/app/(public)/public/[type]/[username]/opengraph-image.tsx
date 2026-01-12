import { ImageResponse } from "next/og";
import { getFollower } from "./actions/actions";

// Image dimensions for OG
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Generate dynamic OG image for each creator profile
export default async function Image({
  params,
}: {
  params: Promise<{ username: string; type: string }>;
}) {
  const { type, username } = await params;
  const follower = await getFollower({ username, type });

  const platformColors: Record<string, { from: string; to: string }> = {
    tiktok: { from: "#00f2ea", to: "#ff0050" },
    twitch: { from: "#9146ff", to: "#772ce8" },
    youtube: { from: "#ff0000", to: "#cc0000" },
    kick: { from: "#53fc18", to: "#45d615" },
    default: { from: "#8B5CF6", to: "#EC4899" },
  };

  const colors = platformColors[type?.toLowerCase()] || platformColors.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
          position: "relative",
        }}
      >
        {/* Background pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />

        {/* Main content container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "60px",
            gap: "60px",
          }}
        >
          {/* Avatar section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Avatar with border */}
            <div
              style={{
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {follower?.avatar?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={follower.avatar.url}
                  width={264}
                  height={264}
                  alt={follower.username || follower.nickname || "Avatar"}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "264px",
                    height: "264px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "120px",
                    color: "white",
                  }}
                >
                  {follower?.nickname?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>

          {/* Text section */}
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
                alignItems: "center",
                gap: "8px",
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
                }}
              >
                {type}
              </div>
            </div>

            {/* Creator name */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.1,
                textShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              {follower?.nickname || username}
            </div>

            {/* Username */}
            <div
              style={{
                fontSize: "32px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              @{username}
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.9)",
                marginTop: "12px",
                lineHeight: 1.4,
              }}
            >
              Watch recorded streams anytime on LiveStreamRecorder
            </div>
          </div>
        </div>

        {/* Bottom branding bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
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
                borderRadius: "50%",
                background: "#ef4444",
              }}
            />
            <span>LiveStreamRecorder</span>
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "20px",
            }}
          >
            Never miss a stream
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
