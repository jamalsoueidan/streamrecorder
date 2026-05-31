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

  // Hard 30-day retention on sources. The S3 lifecycle policy deletes the
  // file from the bucket independently; this task removes the matching DB
  // rows (the `sources` row + its `sources_recording_lnk` row) so listings
  // stop pointing at gone-S3 within at most one cron tick.
  //
  // Batched at 1,000 rows per run to keep the table lock short. With the
  // cron running every 15 min, that's 96,000 rows/day, which is plenty
  // headroom for the ~28K/day failure-rate-equivalent volume. Bump the
  // BATCH constant if a backlog accumulates.
  deleteExpiredSources: {
    task: async ({ strapi }) => {
      const knex = strapi.db.connection;
      const start = Date.now();
      const BATCH = 1000;
      const { rows } = await knex.raw(`
        WITH expired AS (
          SELECT id FROM sources
          WHERE created_at < NOW() - INTERVAL '30 days'
          ORDER BY created_at
          LIMIT ${BATCH}
        ),
        _ AS (
          DELETE FROM sources_recording_lnk
          WHERE source_id IN (SELECT id FROM expired)
        )
        DELETE FROM sources WHERE id IN (SELECT id FROM expired)
        RETURNING id
      `);
      strapi.log.info(
        `[cron] deleteExpiredSources removed ${rows.length} rows in ${Date.now() - start}ms`,
      );
    },
    options: {
      rule: "*/15 * * * *",
    },
  },
};
