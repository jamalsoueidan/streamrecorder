async function up(knex) {
  const hasVisitorDownloads = await knex.schema.hasTable("visitor_downloads");
  const hasRecordings = await knex.schema.hasTable("recordings");

  if (hasRecordings) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_recordings_views_count ON recordings(views_count DESC) WHERE views_count > 0`,
    );
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_recordings_downloads_count ON recordings(downloads_count DESC) WHERE downloads_count > 0`,
    );
  }

  if (hasVisitorDownloads) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_visitor_downloads_ip ON visitor_downloads(ip)`,
    );
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_visitor_downloads_fingerprint ON visitor_downloads(fingerprint)`,
    );
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_visitor_downloads_created_at ON visitor_downloads(created_at)`,
    );
  }
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_recordings_views_count`);
  await knex.raw(`DROP INDEX IF EXISTS idx_recordings_downloads_count`);
  await knex.raw(`DROP INDEX IF EXISTS idx_visitor_downloads_ip`);
  await knex.raw(`DROP INDEX IF EXISTS idx_visitor_downloads_fingerprint`);
  await knex.raw(`DROP INDEX IF EXISTS idx_visitor_downloads_created_at`);
}

module.exports = { up, down };
