async function up(knex) {
  const hasUpUsers = await knex.schema.hasTable("up_users");
  const hasSources = await knex.schema.hasTable("sources");
  const hasSourcesRecordingLnk = await knex.schema.hasTable("sources_recording_lnk");
  const hasVisitorViewsRecordingLnk = await knex.schema.hasTable("visitor_views_recording_lnk");
  const hasFollowers = await knex.schema.hasTable("followers");

  if (hasUpUsers) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_up_users_subscription_status ON up_users(subscription_status)`,
    );
  }

  if (hasSourcesRecordingLnk) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_sources_recording_lnk_recording_source ON sources_recording_lnk(recording_id, source_id)`,
    );
  }

  if (hasSources) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_sources_created_at ON sources(created_at)`,
    );
  }

  if (hasVisitorViewsRecordingLnk) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_visitor_views_recording_lnk_recording ON visitor_views_recording_lnk(recording_id)`,
    );
  }

  if (hasFollowers) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_followers_locale_type ON followers(locale, type)`,
    );
  }
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_up_users_subscription_status`);
  await knex.raw(`DROP INDEX IF EXISTS idx_sources_recording_lnk_recording_source`);
  await knex.raw(`DROP INDEX IF EXISTS idx_sources_created_at`);
  await knex.raw(`DROP INDEX IF EXISTS idx_visitor_views_recording_lnk_recording`);
  await knex.raw(`DROP INDEX IF EXISTS idx_followers_locale_type`);
}

module.exports = { up, down };
