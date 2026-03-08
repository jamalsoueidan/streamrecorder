async function up(knex) {
  const hasRecordings = await knex.schema.hasTable("recordings");
  const hasFollowers = await knex.schema.hasTable("followers");

  if (hasRecordings) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_recordings_locale_hidden ON recordings(locale, hidden)`,
    );
  }

  if (hasFollowers) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_followers_username_type ON followers(username, type)`,
    );
  }
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_recordings_locale_hidden`);
  await knex.raw(`DROP INDEX IF EXISTS idx_followers_username_type`);
}

module.exports = { up, down };
