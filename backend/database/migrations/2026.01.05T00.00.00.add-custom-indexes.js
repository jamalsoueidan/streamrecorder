"use strict";

async function up(knex) {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_sources_state ON sources(state);
  `);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_sources_state_id ON sources(state, id);
  `);
}

module.exports = { up };
