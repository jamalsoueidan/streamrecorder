async function up(knex) {
  const hasTable = await knex.schema.hasTable("sources");

  if (!hasTable) return;

  await knex.raw(
    `CREATE INDEX IF NOT EXISTS idx_sources_path ON sources(path)`,
  );

  await knex.raw(
    `CREATE INDEX IF NOT EXISTS idx_visitor_views_fingerprint ON visitor_views(fingerprint)`,
  );
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_sources_path`);
  await knex.raw(`DROP INDEX IF EXISTS idx_visitor_views_fingerprint`);
}

module.exports = { up, down };
