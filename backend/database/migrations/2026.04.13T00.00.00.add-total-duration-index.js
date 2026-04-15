async function up(knex) {
  const hasRecordings = await knex.schema.hasTable("recordings");

  if (hasRecordings) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_recordings_total_duration ON recordings(total_duration)`,
    );
  }
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_recordings_total_duration`);
}

module.exports = { up, down };
