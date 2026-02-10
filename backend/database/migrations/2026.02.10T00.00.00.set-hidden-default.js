async function up(knex) {
  await knex.raw(`UPDATE recordings SET hidden = false WHERE hidden IS NULL`);
}

async function down(knex) {
  // Nothing to revert
}

module.exports = { up, down };
