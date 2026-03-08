async function up(knex) {
  const hasStrapiCoreStoreSettings = await knex.schema.hasTable("strapi_core_store_settings");
  const hasStrapiApiTokens = await knex.schema.hasTable("strapi_api_tokens");
  const hasUpPermissions = await knex.schema.hasTable("up_permissions");
  const hasUpPermissionsRoleLnk = await knex.schema.hasTable("up_permissions_role_lnk");
  const hasUpRoles = await knex.schema.hasTable("up_roles");

  if (hasStrapiCoreStoreSettings) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_strapi_core_store_settings_key ON strapi_core_store_settings(key)`,
    );
  }

  if (hasStrapiApiTokens) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_strapi_api_tokens_access_key ON strapi_api_tokens(access_key)`,
    );
  }

  if (hasUpPermissions) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_up_permissions_action ON up_permissions(action)`,
    );
  }

  if (hasUpPermissionsRoleLnk) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_up_permissions_role_lnk_role_id ON up_permissions_role_lnk(role_id)`,
    );
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_up_permissions_role_lnk_permission_id ON up_permissions_role_lnk(permission_id)`,
    );
  }

  if (hasUpRoles) {
    await knex.raw(
      `CREATE INDEX IF NOT EXISTS idx_up_roles_type ON up_roles(type)`,
    );
  }
}

async function down(knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_strapi_core_store_settings_key`);
  await knex.raw(`DROP INDEX IF EXISTS idx_strapi_api_tokens_access_key`);
  await knex.raw(`DROP INDEX IF EXISTS idx_up_permissions_action`);
  await knex.raw(`DROP INDEX IF EXISTS idx_up_permissions_role_lnk_role_id`);
  await knex.raw(`DROP INDEX IF EXISTS idx_up_permissions_role_lnk_permission_id`);
  await knex.raw(`DROP INDEX IF EXISTS idx_up_roles_type`);
}

module.exports = { up, down };
