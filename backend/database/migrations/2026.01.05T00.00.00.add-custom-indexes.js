async function up(knex) {
  // Check if table exists first
  const hasTable = await knex.schema.hasTable("sources");

  if (hasTable) {
    // PostgreSQL syntax
    await knex.raw(`
      CREATE INDEX IF NOT EXISTS idx_sources_state ON sources(state);
    `);
  }
}

async function down(knex) {
  const hasTable = await knex.schema.hasTable("sources");

  if (hasTable) {
    await knex.raw(`
      DROP INDEX IF EXISTS idx_sources_state;
    `);
  }
}

module.exports = { up, down };
