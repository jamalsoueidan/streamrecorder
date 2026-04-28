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
};
