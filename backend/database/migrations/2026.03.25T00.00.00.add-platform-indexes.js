async function up(knex) {
  const hasFollowers = await knex.schema.hasTable("followers");

  if (hasFollowers) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_followers_lsr ON followers(lsr) WHERE lsr = true`,
    );
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_followers_sar ON followers(sar) WHERE sar = true`,
    );
  }
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_followers_lsr`);
  await knex.raw(`DROP INDEX IF EXISTS idx_followers_sar`);
}

module.exports = { up, down };
