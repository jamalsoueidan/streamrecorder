import "server-only";

const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

// Purge specific URLs from Cloudflare's cache. Used after deletes so the
// stale HTML CF holds in its edge cache is dropped — otherwise visitors
// keep seeing the deleted resource for up to s-maxage seconds.
//
// Never throws — purge failure should not fail the parent operation.
export async function purgeCloudflareUrls(urls: string[]): Promise<void> {
  if (!CF_API_TOKEN || !CF_ZONE_ID) {
    console.warn(
      "[cloudflare] purge skipped: CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID not set",
    );
    return;
  }
  if (urls.length === 0) return;

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: urls }),
      },
    );
    if (!res.ok) {
      console.error(
        "[cloudflare] purge failed:",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (error) {
    console.error("[cloudflare] purge error:", error);
  }
}
