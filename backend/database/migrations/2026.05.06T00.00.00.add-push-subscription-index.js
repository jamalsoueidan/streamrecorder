// Partial index on users that have a push subscription. Used by the
// /user/notify-streamers-live fan-out: when looking up subscribers for
// the live streamers, we filter on `push_subscription IS NOT NULL`.
// Without this index Postgres scans every linked user, of which the
// vast majority haven't subscribed yet — wasted I/O.
//
// `CREATE INDEX CONCURRENTLY` would normally be preferred for a large
// table, but Strapi's migration runner wraps each up() in a transaction
// and CONCURRENTLY isn't allowed inside a transaction. Plain CREATE is
// fine here since the index is small (only matches subscribed users).
async function up(knex) {
  const hasTable = await knex.schema.hasTable("up_users");
  if (hasTable) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_up_users_with_push
       ON up_users (id) WHERE push_subscription IS NOT NULL`,
    );
  }
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_up_users_with_push`);
}

module.exports = { up, down };
