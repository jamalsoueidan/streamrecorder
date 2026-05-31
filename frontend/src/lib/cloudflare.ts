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

  // CF caps purge_cache at 30 URLs per request, so chunk when needed.
  // Run batches sequentially — parallel POSTs to the same endpoint risk
  // CF rate-limiting and the operation is best-effort anyway.
  const BATCH = 30;
  for (let i = 0; i < urls.length; i += BATCH) {
    const chunk = urls.slice(i, i + BATCH);
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CF_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ files: chunk }),
        },
      );
      if (!res.ok) {
        console.error(
          "[cloudflare] purge batch failed:",
          res.status,
          await res.text().catch(() => ""),
        );
      }
    } catch (error) {
      console.error("[cloudflare] purge batch error:", error);
    }
  }
}
