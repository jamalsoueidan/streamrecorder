#!/usr/bin/env node

const token = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;

if (!token || !zoneId) {
  console.warn(
    "⚠️  Skipping Cloudflare cache purge: CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID not set"
  );
  process.exit(0);
}

async function purgeCache() {
  try {
    console.log("🔄 Purging Cloudflare cache...");
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ purge_everything: true }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("✅ Cloudflare cache purged successfully");
      process.exit(0);
    } else {
      console.error(
        "❌ Cloudflare cache purge failed:",
        data.errors?.map((e) => e.message).join(", ")
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error purging Cloudflare cache:", error);
    process.exit(1);
  }
}

purgeCache();

