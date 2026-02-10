async function up(knex) {
  const hasTable = await knex.schema.hasTable("recordings");

  if (!hasTable) return;

  await knex.raw(`UPDATE recordings SET hidden = false WHERE hidden IS NULL`);
}

async function down(knex) {
  // Nothing to revert
}

module.exports = { up, down };
