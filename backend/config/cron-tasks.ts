import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  forcePathStyle: true,
});

// Refuse anything that could wipe more than one recording folder.
// Valid path shape: "/<platform>/<username>/<timestamp>/" → 3+ segments
// after splitting, starts with "/", ends with "/", length > 10.
// Bucket must start with "streamrecorder-" so we can never target a
// non-recording bucket by accident.
function assertSafe(bucket: string, path: string) {
  if (!bucket || !bucket.startsWith("streamrecorder-")) {
    throw new Error(`unsafe bucket: ${JSON.stringify(bucket)}`);
  }
  if (!path || typeof path !== "string") {
    throw new Error(`unsafe path: ${JSON.stringify(path)}`);
  }
  if (!path.startsWith("/") || !path.endsWith("/")) {
    throw new Error(`unsafe path (must start+end with /): ${path}`);
  }
  if (path.length < 10) {
    throw new Error(`unsafe path (too short): ${path}`);
  }
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 3) {
    throw new Error(`unsafe path (need >= 3 segments): ${path}`);
  }
}

const DRY_RUN = process.env.CRON_DELETE_DRY_RUN === "1";

async function deleteS3Prefix(
  bucket: string,
  prefix: string,
  log: (m: string) => void,
) {
  let token: string | undefined;
  let totalKeys = 0;
  do {
    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: token,
      }),
    );
    const objects = (list.Contents ?? []).map((o) => ({ Key: o.Key as string }));
    totalKeys += objects.length;
    if (objects.length > 0 && !DRY_RUN) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: objects, Quiet: true },
        }),
      );
    }
    token = list.IsTruncated ? list.NextContinuationToken : undefined;
  } while (token);
  if (DRY_RUN) {
    log(`[DRY] would delete ${totalKeys} keys under ${bucket}/${prefix}`);
  }
}

export default {
  refreshFollowerRecordingAggregates: {
    task: async ({ strapi }) => {
      const knex = strapi.db.connection;
      const start = Date.now();
      await knex.raw(`
        UPDATE followers f
        SET
          recordings_count  = COALESCE(agg.cnt, 0),
          last_recording_at = agg.last_at
        FROM (
          SELECT rf.follower_id,
                 COUNT(DISTINCT r.id) AS cnt,
                 MAX(r.created_at)    AS last_at
          FROM recordings_follower_lnk rf
          JOIN recordings r ON r.id = rf.recording_id
          WHERE EXISTS (
            SELECT 1 FROM sources_recording_lnk srl
            JOIN sources s ON s.id = srl.source_id
            WHERE srl.recording_id = r.id AND s.state != 'failed'
          )
          GROUP BY rf.follower_id
        ) agg
        WHERE f.id = agg.follower_id
          AND (
            f.recordings_count  IS DISTINCT FROM COALESCE(agg.cnt, 0)
         OR f.last_recording_at IS DISTINCT FROM agg.last_at
          )
      `);
      await knex.raw(`
        UPDATE followers
        SET recordings_count = 0, last_recording_at = NULL
        WHERE recordings_count > 0
          AND id NOT IN (
            SELECT DISTINCT rf.follower_id
            FROM recordings_follower_lnk rf
            JOIN recordings r ON r.id = rf.recording_id
            WHERE EXISTS (
              SELECT 1 FROM sources_recording_lnk srl
              JOIN sources s ON s.id = srl.source_id
              WHERE srl.recording_id = r.id AND s.state != 'failed'
            )
          )
      `);
      strapi.log.info(
        `[cron] refreshFollowerRecordingAggregates done in ${Date.now() - start}ms`,
      );
    },
    options: {
      rule: "*/15 * * * *",
    },
  },

  refreshRecentRecordingDurations: {
    task: async ({ strapi }) => {
      const knex = strapi.db.connection;
      const start = Date.now();
      await knex.raw(`
        UPDATE recordings r
        SET total_duration = sub.total
        FROM (
          SELECT srl.recording_id, SUM(s.duration) AS total
          FROM sources_recording_lnk srl
          JOIN sources s ON s.id = srl.source_id
          WHERE s.state = 'done'
            AND srl.recording_id IN (
              SELECT srl2.recording_id
              FROM sources_recording_lnk srl2
              JOIN sources s2 ON s2.id = srl2.source_id
              WHERE s2.state = 'done'
                AND s2.updated_at > NOW() - INTERVAL '4 hours'
            )
          GROUP BY srl.recording_id
        ) sub
        WHERE r.id = sub.recording_id
          AND (r.total_duration IS NULL OR r.total_duration != sub.total)
      `);
      strapi.log.info(
        `[cron] refreshRecentRecordingDurations done in ${Date.now() - start}ms`,
      );
    },
    options: {
      rule: "*/15 * * * *",
    },
  },

  // 30-day retention. For each expired source: list every object under its
  // S3 prefix and delete them via batch DeleteObjects, THEN drop the DB
  // row. Ordering matters — if S3 fails, the row stays so the next tick
  // retries. No row is ever orphaned pointing at a gone-S3 prefix.
  deleteExpiredSources: {
    task: async ({ strapi }) => {
      const knex = strapi.db.connection;
      const start = Date.now();
      const BATCH = 1000;
      const CONCURRENCY = 20;

      const { rows: expired } = (await knex.raw(`
        SELECT id, bucket, path
        FROM sources
        WHERE created_at < NOW() - INTERVAL '30 days'
          AND bucket IS NOT NULL
          AND path IS NOT NULL
        ORDER BY created_at
        LIMIT ${BATCH}
      `)) as { rows: Array<{ id: number; bucket: string; path: string }> };

      if (expired.length === 0) {
        strapi.log.info(
          `[cron] deleteExpiredSources: nothing to do (${Date.now() - start}ms)`,
        );
        return;
      }

      const deletedIds: number[] = [];
      let failed = 0;
      let cursor = 0;

      await Promise.all(
        Array.from({ length: CONCURRENCY }, async () => {
          while (true) {
            const i = cursor++;
            if (i >= expired.length) return;
            const src = expired[i];
            try {
              assertSafe(src.bucket, src.path);
              const prefix = src.path.replace(/^\//, "");
              await deleteS3Prefix(src.bucket, prefix, (m) =>
                strapi.log.info(m),
              );
              if (!DRY_RUN) deletedIds.push(src.id);
            } catch (err) {
              failed++;
              strapi.log.warn(
                `[cron] deleteExpiredSources s3 fail id=${src.id} ${src.bucket}${src.path}: ${(err as Error).message}`,
              );
            }
          }
        }),
      );

      if (deletedIds.length > 0) {
        await knex.raw(
          "DELETE FROM sources_recording_lnk WHERE source_id = ANY(?::int[])",
          [deletedIds],
        );
        await knex.raw("DELETE FROM sources WHERE id = ANY(?::int[])", [
          deletedIds,
        ]);
      }

      strapi.log.info(
        `[cron] deleteExpiredSources removed ${deletedIds.length} (s3+db), failed ${failed} in ${Date.now() - start}ms`,
      );
    },
    options: {
      rule: "*/15 * * * *",
    },
  },
};
