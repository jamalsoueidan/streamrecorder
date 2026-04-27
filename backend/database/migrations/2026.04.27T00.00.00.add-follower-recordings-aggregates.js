async function up(knex) {
  const hasFollowers = await knex.schema.hasTable("followers");
  if (!hasFollowers) return;

  const hasLast = await knex.schema.hasColumn("followers", "last_recording_at");
  if (hasLast) {
    await knex.raw(`
      CREATE INDEX IF NOT EXISTS idx_followers_locale_last_recording
        ON followers (locale, last_recording_at DESC NULLS LAST, id)
    `);
  }

  const hasCount = await knex.schema.hasColumn("followers", "recordings_count");
  if (hasCount) {
    await knex.raw(`
      CREATE INDEX IF NOT EXISTS idx_followers_locale_recordings_count
        ON followers (locale, recordings_count DESC, id)
    `);
  }
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_followers_locale_last_recording`);
  await knex.raw(`DROP INDEX IF EXISTS idx_followers_locale_recordings_count`);
}

module.exports = { up, down };
