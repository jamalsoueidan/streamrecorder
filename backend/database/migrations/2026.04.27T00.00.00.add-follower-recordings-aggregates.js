async function up(knex) {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_followers_locale_last_recording
      ON followers (locale, last_recording_at DESC NULLS LAST, id)
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_followers_locale_recordings_count
      ON followers (locale, recordings_count DESC, id)
  `);
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_followers_locale_last_recording`);
  await knex.raw(`DROP INDEX IF EXISTS idx_followers_locale_recordings_count`);
}

module.exports = { up, down };
