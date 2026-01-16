import {
  bigint,
  boolean,
  doublePrecision,
  foreignKey,
  index,
  integer,
  json,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const adminPermissionsRoleLnk = pgTable(
  "admin_permissions_role_lnk",
  {
    id: serial().primaryKey().notNull(),
    permissionId: integer("permission_id"),
    roleId: integer("role_id"),
    permissionOrd: doublePrecision("permission_ord"),
  },
  (table) => [
    index("admin_permissions_role_lnk_fk").using(
      "btree",
      table.permissionId.asc().nullsLast().op("int4_ops")
    ),
    index("admin_permissions_role_lnk_ifk").using(
      "btree",
      table.roleId.asc().nullsLast().op("int4_ops")
    ),
    index("admin_permissions_role_lnk_oifk").using(
      "btree",
      table.permissionOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [adminPermissions.id],
      name: "admin_permissions_role_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [adminRoles.id],
      name: "admin_permissions_role_lnk_ifk",
    }).onDelete("cascade"),
    unique("admin_permissions_role_lnk_uq").on(
      table.roleId,
      table.permissionId
    ),
  ]
);

export const adminUsersRolesLnk = pgTable(
  "admin_users_roles_lnk",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id"),
    roleId: integer("role_id"),
    roleOrd: doublePrecision("role_ord"),
    userOrd: doublePrecision("user_ord"),
  },
  (table) => [
    index("admin_users_roles_lnk_fk").using(
      "btree",
      table.userId.asc().nullsLast().op("int4_ops")
    ),
    index("admin_users_roles_lnk_ifk").using(
      "btree",
      table.roleId.asc().nullsLast().op("int4_ops")
    ),
    index("admin_users_roles_lnk_ofk").using(
      "btree",
      table.roleOrd.asc().nullsLast().op("float8_ops")
    ),
    index("admin_users_roles_lnk_oifk").using(
      "btree",
      table.userOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [adminUsers.id],
      name: "admin_users_roles_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [adminRoles.id],
      name: "admin_users_roles_lnk_ifk",
    }).onDelete("cascade"),
    unique("admin_users_roles_lnk_uq").on(table.userId, table.roleId),
  ]
);

export const adminRoles = pgTable(
  "admin_roles",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    code: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("admin_roles_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("admin_roles_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("admin_roles_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "admin_roles_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "admin_roles_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const changeLogs = pgTable(
  "change_logs",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    version: varchar({ length: 255 }),
    body: text(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("change_logs_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("change_logs_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("change_logs_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "change_logs_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "change_logs_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const componentsVideosVideos = pgTable("components_videos_videos", {
  id: serial().primaryKey().notNull(),
  playlist: text(),
  width: integer(),
  height: integer(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  sizeBytes: bigint("size_bytes", { mode: "number" }),
});

export const adminUsers = pgTable(
  "admin_users",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    firstname: varchar({ length: 255 }),
    lastname: varchar({ length: 255 }),
    username: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    password: varchar({ length: 255 }),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    registrationToken: varchar("registration_token", { length: 255 }),
    isActive: boolean("is_active"),
    blocked: boolean(),
    preferedLanguage: varchar("prefered_language", { length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("admin_users_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("admin_users_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("admin_users_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [table.id],
      name: "admin_users_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [table.id],
      name: "admin_users_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const articles = pgTable(
  "articles",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    title: varchar({ length: 255 }),
    content: text(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("articles_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("articles_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("articles_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "articles_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "articles_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const files = pgTable(
  "files",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    alternativeText: text("alternative_text"),
    caption: text(),
    width: integer(),
    height: integer(),
    formats: jsonb(),
    hash: varchar({ length: 255 }),
    ext: varchar({ length: 255 }),
    mime: varchar({ length: 255 }),
    size: numeric({ precision: 10, scale: 2 }),
    url: text(),
    previewUrl: text("preview_url"),
    provider: varchar({ length: 255 }),
    providerMetadata: jsonb("provider_metadata"),
    folderPath: varchar("folder_path", { length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("files_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("files_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("files_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    index("upload_files_created_at_index").using(
      "btree",
      table.createdAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("upload_files_ext_index").using(
      "btree",
      table.ext.asc().nullsLast().op("text_ops")
    ),
    index("upload_files_folder_path_index").using(
      "btree",
      table.folderPath.asc().nullsLast().op("text_ops")
    ),
    index("upload_files_name_index").using(
      "btree",
      table.name.asc().nullsLast().op("text_ops")
    ),
    index("upload_files_size_index").using(
      "btree",
      table.size.asc().nullsLast().op("numeric_ops")
    ),
    index("upload_files_updated_at_index").using(
      "btree",
      table.updatedAt.asc().nullsLast().op("timestamp_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "files_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "files_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const filesFolderLnk = pgTable(
  "files_folder_lnk",
  {
    id: serial().primaryKey().notNull(),
    fileId: integer("file_id"),
    folderId: integer("folder_id"),
    fileOrd: doublePrecision("file_ord"),
  },
  (table) => [
    index("files_folder_lnk_fk").using(
      "btree",
      table.fileId.asc().nullsLast().op("int4_ops")
    ),
    index("files_folder_lnk_ifk").using(
      "btree",
      table.folderId.asc().nullsLast().op("int4_ops")
    ),
    index("files_folder_lnk_oifk").using(
      "btree",
      table.fileOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.fileId],
      foreignColumns: [files.id],
      name: "files_folder_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.folderId],
      foreignColumns: [uploadFolders.id],
      name: "files_folder_lnk_ifk",
    }).onDelete("cascade"),
    unique("files_folder_lnk_uq").on(table.folderId, table.fileId),
  ]
);

export const messages = pgTable(
  "messages",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    type: varchar({ length: 255 }),
    subject: varchar({ length: 255 }),
    content: text(),
    state: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("messages_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("messages_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("messages_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "messages_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "messages_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const messagesUserLnk = pgTable(
  "messages_user_lnk",
  {
    id: serial().primaryKey().notNull(),
    messageId: integer("message_id"),
    userId: integer("user_id"),
    messageOrd: doublePrecision("message_ord"),
  },
  (table) => [
    index("messages_user_lnk_fk").using(
      "btree",
      table.messageId.asc().nullsLast().op("int4_ops")
    ),
    index("messages_user_lnk_ifk").using(
      "btree",
      table.userId.asc().nullsLast().op("int4_ops")
    ),
    index("messages_user_lnk_oifk").using(
      "btree",
      table.messageOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.messageId],
      foreignColumns: [messages.id],
      name: "messages_user_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [upUsers.id],
      name: "messages_user_lnk_ifk",
    }).onDelete("cascade"),
    unique("messages_user_lnk_uq").on(table.userId, table.messageId),
  ]
);

export const recordings = pgTable(
  "recordings",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    followerId: integer("follower_id").references(() => followers.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("recordings_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("recordings_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("recordings_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "recordings_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "recordings_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const recordingsFollowerLnk = pgTable(
  "recordings_follower_lnk",
  {
    id: serial().primaryKey().notNull(),
    recordingId: integer("recording_id"),
    followerId: integer("follower_id"),
  },
  (table) => [
    index("recordings_follower_lnk_fk").using(
      "btree",
      table.recordingId.asc().nullsLast().op("int4_ops")
    ),
    index("recordings_follower_lnk_ifk").using(
      "btree",
      table.followerId.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.recordingId],
      foreignColumns: [recordings.id],
      name: "recordings_follower_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.followerId],
      foreignColumns: [followers.id],
      name: "recordings_follower_lnk_ifk",
    }).onDelete("cascade"),
    unique("recordings_follower_lnk_uq").on(
      table.recordingId,
      table.followerId
    ),
  ]
);

export const sourcesCmps = pgTable(
  "sources_cmps",
  {
    id: serial().primaryKey().notNull(),
    entityId: integer("entity_id"),
    cmpId: integer("cmp_id"),
    componentType: varchar("component_type", { length: 255 }),
    field: varchar({ length: 255 }),
    order: doublePrecision(),
  },
  (table) => [
    index("sources_component_type_idx").using(
      "btree",
      table.componentType.asc().nullsLast().op("text_ops")
    ),
    index("sources_entity_fk").using(
      "btree",
      table.entityId.asc().nullsLast().op("int4_ops")
    ),
    index("sources_field_idx").using(
      "btree",
      table.field.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.entityId],
      foreignColumns: [sources.id],
      name: "sources_entity_fk",
    }).onDelete("cascade"),
    unique("sources_uq").on(
      table.field,
      table.entityId,
      table.componentType,
      table.cmpId
    ),
  ]
);

export const recordingsSourcesLnk = pgTable(
  "recordings_sources_lnk",
  {
    id: serial().primaryKey().notNull(),
    recordingId: integer("recording_id"),
    sourceId: integer("source_id"),
    sourceOrd: doublePrecision("source_ord"),
  },
  (table) => [
    index("recordings_sources_lnk_fk").using(
      "btree",
      table.recordingId.asc().nullsLast().op("int4_ops")
    ),
    index("recordings_sources_lnk_ifk").using(
      "btree",
      table.sourceId.asc().nullsLast().op("int4_ops")
    ),
    index("recordings_sources_lnk_ofk").using(
      "btree",
      table.sourceOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.recordingId],
      foreignColumns: [recordings.id],
      name: "recordings_sources_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.sourceId],
      foreignColumns: [sources.id],
      name: "recordings_sources_lnk_ifk",
    }).onDelete("cascade"),
    unique("recordings_sources_lnk_uq").on(table.sourceId, table.recordingId),
  ]
);

export const sources = pgTable(
  "sources",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    recordingId: integer("recording_id").references(() => recordings.id, {
      onDelete: "cascade",
    }),
    videoOriginalPlaylist: text("video_original_playlist"),
    videoOriginalWidth: integer("video_original_width"),
    videoOriginalHeight: integer("video_original_height"),
    videoOriginalSize: bigint("video_original_size", { mode: "number" }),
    videoSmallPlaylist: text("video_small_playlist"),
    videoSmallWidth: integer("video_small_width"),
    videoSmallHeight: integer("video_small_height"),
    videoSmallSize: bigint("video_small_size", { mode: "number" }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
    state: varchar({ length: 255 }),
    executionId: integer("execution_id"),
    finishedAt: timestamp("finished_at", { precision: 6, mode: "string" }),
    path: varchar({ length: 255 }),
    duration: numeric({ precision: 10, scale: 2 }),
    thumbnailInterval: integer("thumbnail_interval"),
    thumbnailCols: integer("thumbnail_cols"),
  },
  (table) => [
    index("idx_sources_state").using(
      "btree",
      table.state.asc().nullsLast().op("text_ops")
    ),
    index("idx_sources_state_id").using(
      "btree",
      table.state.asc().nullsLast().op("int4_ops"),
      table.id.asc().nullsLast().op("int4_ops")
    ),
    index("sources_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("sources_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("text_ops")
    ),
    index("sources_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "sources_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "sources_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiAiLocalizationJobs = pgTable("strapi_ai_localization_jobs", {
  id: serial().primaryKey().notNull(),
  contentType: varchar("content_type", { length: 255 }).notNull(),
  relatedDocumentId: varchar("related_document_id", { length: 255 }).notNull(),
  sourceLocale: varchar("source_locale", { length: 255 }).notNull(),
  targetLocales: jsonb("target_locales").notNull(),
  status: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

export const strapiApiTokenPermissionsTokenLnk = pgTable(
  "strapi_api_token_permissions_token_lnk",
  {
    id: serial().primaryKey().notNull(),
    apiTokenPermissionId: integer("api_token_permission_id"),
    apiTokenId: integer("api_token_id"),
    apiTokenPermissionOrd: doublePrecision("api_token_permission_ord"),
  },
  (table) => [
    index("strapi_api_token_permissions_token_lnk_fk").using(
      "btree",
      table.apiTokenPermissionId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_api_token_permissions_token_lnk_ifk").using(
      "btree",
      table.apiTokenId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_api_token_permissions_token_lnk_oifk").using(
      "btree",
      table.apiTokenPermissionOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.apiTokenPermissionId],
      foreignColumns: [strapiApiTokenPermissions.id],
      name: "strapi_api_token_permissions_token_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.apiTokenId],
      foreignColumns: [strapiApiTokens.id],
      name: "strapi_api_token_permissions_token_lnk_ifk",
    }).onDelete("cascade"),
    unique("strapi_api_token_permissions_token_lnk_uq").on(
      table.apiTokenPermissionId,
      table.apiTokenId
    ),
  ]
);

export const strapiHistoryVersions = pgTable(
  "strapi_history_versions",
  {
    id: serial().primaryKey().notNull(),
    contentType: varchar("content_type", { length: 255 }).notNull(),
    relatedDocumentId: varchar("related_document_id", { length: 255 }),
    locale: varchar({ length: 255 }),
    status: varchar({ length: 255 }),
    data: jsonb(),
    schema: jsonb(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
  },
  (table) => [
    index("strapi_history_versions_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_history_versions_created_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiCoreStoreSettings = pgTable("strapi_core_store_settings", {
  id: serial().primaryKey().notNull(),
  key: varchar({ length: 255 }),
  value: text(),
  type: varchar({ length: 255 }),
  environment: varchar({ length: 255 }),
  tag: varchar({ length: 255 }),
});

export const strapiDatabaseSchema = pgTable("strapi_database_schema", {
  id: serial().primaryKey().notNull(),
  schema: json(),
  time: timestamp({ mode: "string" }),
  hash: varchar({ length: 255 }),
});

export const strapiReleaseActions = pgTable(
  "strapi_release_actions",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    type: varchar({ length: 255 }),
    contentType: varchar("content_type", { length: 255 }),
    entryDocumentId: varchar("entry_document_id", { length: 255 }),
    locale: varchar({ length: 255 }),
    isEntryValid: boolean("is_entry_valid"),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
  },
  (table) => [
    index("strapi_release_actions_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_release_actions_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("strapi_release_actions_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_release_actions_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "strapi_release_actions_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiMigrations = pgTable("strapi_migrations", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }),
  time: timestamp({ mode: "string" }),
});

export const strapiMigrationsInternal = pgTable("strapi_migrations_internal", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }),
  time: timestamp({ mode: "string" }),
});

export const strapiReleaseActionsReleaseLnk = pgTable(
  "strapi_release_actions_release_lnk",
  {
    id: serial().primaryKey().notNull(),
    releaseActionId: integer("release_action_id"),
    releaseId: integer("release_id"),
    releaseActionOrd: doublePrecision("release_action_ord"),
  },
  (table) => [
    index("strapi_release_actions_release_lnk_fk").using(
      "btree",
      table.releaseActionId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_release_actions_release_lnk_ifk").using(
      "btree",
      table.releaseId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_release_actions_release_lnk_oifk").using(
      "btree",
      table.releaseActionOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.releaseActionId],
      foreignColumns: [strapiReleaseActions.id],
      name: "strapi_release_actions_release_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.releaseId],
      foreignColumns: [strapiReleases.id],
      name: "strapi_release_actions_release_lnk_ifk",
    }).onDelete("cascade"),
    unique("strapi_release_actions_release_lnk_uq").on(
      table.releaseId,
      table.releaseActionId
    ),
  ]
);

export const strapiSessions = pgTable(
  "strapi_sessions",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    userId: varchar("user_id", { length: 255 }),
    sessionId: varchar("session_id", { length: 255 }),
    childId: varchar("child_id", { length: 255 }),
    deviceId: varchar("device_id", { length: 255 }),
    origin: varchar({ length: 255 }),
    expiresAt: timestamp("expires_at", { precision: 6, mode: "string" }),
    absoluteExpiresAt: timestamp("absolute_expires_at", {
      precision: 6,
      mode: "string",
    }),
    status: varchar({ length: 255 }),
    type: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("strapi_sessions_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_sessions_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("strapi_sessions_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_sessions_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "strapi_sessions_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiApiTokens = pgTable(
  "strapi_api_tokens",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    type: varchar({ length: 255 }),
    accessKey: varchar("access_key", { length: 255 }),
    encryptedKey: text("encrypted_key"),
    lastUsedAt: timestamp("last_used_at", { precision: 6, mode: "string" }),
    expiresAt: timestamp("expires_at", { precision: 6, mode: "string" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    lifespan: bigint({ mode: "number" }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("strapi_api_tokens_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_api_tokens_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("strapi_api_tokens_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_api_tokens_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "strapi_api_tokens_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiReleases = pgTable(
  "strapi_releases",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    releasedAt: timestamp("released_at", { precision: 6, mode: "string" }),
    scheduledAt: timestamp("scheduled_at", { precision: 6, mode: "string" }),
    timezone: varchar({ length: 255 }),
    status: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("strapi_releases_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_releases_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("strapi_releases_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_releases_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "strapi_releases_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiTransferTokenPermissionsTokenLnk = pgTable(
  "strapi_transfer_token_permissions_token_lnk",
  {
    id: serial().primaryKey().notNull(),
    transferTokenPermissionId: integer("transfer_token_permission_id"),
    transferTokenId: integer("transfer_token_id"),
    transferTokenPermissionOrd: doublePrecision(
      "transfer_token_permission_ord"
    ),
  },
  (table) => [
    index("strapi_transfer_token_permissions_token_lnk_fk").using(
      "btree",
      table.transferTokenPermissionId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_transfer_token_permissions_token_lnk_ifk").using(
      "btree",
      table.transferTokenId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_transfer_token_permissions_token_lnk_oifk").using(
      "btree",
      table.transferTokenPermissionOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.transferTokenPermissionId],
      foreignColumns: [strapiTransferTokenPermissions.id],
      name: "strapi_transfer_token_permissions_token_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.transferTokenId],
      foreignColumns: [strapiTransferTokens.id],
      name: "strapi_transfer_token_permissions_token_lnk_ifk",
    }).onDelete("cascade"),
    unique("strapi_transfer_token_permissions_token_lnk_uq").on(
      table.transferTokenPermissionId,
      table.transferTokenId
    ),
  ]
);

export const strapiWorkflows = pgTable(
  "strapi_workflows",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    contentTypes: jsonb("content_types"),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("strapi_workflows_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_workflows_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("strapi_workflows_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_workflows_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "strapi_workflows_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiWebhooks = pgTable("strapi_webhooks", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }),
  url: text(),
  headers: jsonb(),
  events: jsonb(),
  enabled: boolean(),
});

export const strapiWorkflowsStageRequiredToPublishLnk = pgTable(
  "strapi_workflows_stage_required_to_publish_lnk",
  {
    id: serial().primaryKey().notNull(),
    workflowId: integer("workflow_id"),
    workflowStageId: integer("workflow_stage_id"),
  },
  (table) => [
    index("strapi_workflows_stage_required_to_publish_lnk_fk").using(
      "btree",
      table.workflowId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_workflows_stage_required_to_publish_lnk_ifk").using(
      "btree",
      table.workflowStageId.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.workflowId],
      foreignColumns: [strapiWorkflows.id],
      name: "strapi_workflows_stage_required_to_publish_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.workflowStageId],
      foreignColumns: [strapiWorkflowsStages.id],
      name: "strapi_workflows_stage_required_to_publish_lnk_ifk",
    }).onDelete("cascade"),
    unique("strapi_workflows_stage_required_to_publish_lnk_uq").on(
      table.workflowStageId,
      table.workflowId
    ),
  ]
);

export const strapiWorkflowsStagesPermissionsLnk = pgTable(
  "strapi_workflows_stages_permissions_lnk",
  {
    id: serial().primaryKey().notNull(),
    workflowStageId: integer("workflow_stage_id"),
    permissionId: integer("permission_id"),
    permissionOrd: doublePrecision("permission_ord"),
  },
  (table) => [
    index("strapi_workflows_stages_permissions_lnk_fk").using(
      "btree",
      table.workflowStageId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_workflows_stages_permissions_lnk_ifk").using(
      "btree",
      table.permissionId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_workflows_stages_permissions_lnk_ofk").using(
      "btree",
      table.permissionOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.workflowStageId],
      foreignColumns: [strapiWorkflowsStages.id],
      name: "strapi_workflows_stages_permissions_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [adminPermissions.id],
      name: "strapi_workflows_stages_permissions_lnk_ifk",
    }).onDelete("cascade"),
    unique("strapi_workflows_stages_permissions_lnk_uq").on(
      table.workflowStageId,
      table.permissionId
    ),
  ]
);

export const upPermissionsRoleLnk = pgTable(
  "up_permissions_role_lnk",
  {
    id: serial().primaryKey().notNull(),
    permissionId: integer("permission_id"),
    roleId: integer("role_id"),
    permissionOrd: doublePrecision("permission_ord"),
  },
  (table) => [
    index("up_permissions_role_lnk_fk").using(
      "btree",
      table.permissionId.asc().nullsLast().op("int4_ops")
    ),
    index("up_permissions_role_lnk_ifk").using(
      "btree",
      table.roleId.asc().nullsLast().op("int4_ops")
    ),
    index("up_permissions_role_lnk_oifk").using(
      "btree",
      table.permissionOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [upPermissions.id],
      name: "up_permissions_role_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [upRoles.id],
      name: "up_permissions_role_lnk_ifk",
    }).onDelete("cascade"),
    unique("up_permissions_role_lnk_uq").on(table.roleId, table.permissionId),
  ]
);

export const upUsersFollowersLnk = pgTable(
  "up_users_followers_lnk",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id"),
    followerId: integer("follower_id"),
    followerOrd: doublePrecision("follower_ord"),
  },
  (table) => [
    index("up_users_followers_lnk_fk").using(
      "btree",
      table.userId.asc().nullsLast().op("int4_ops")
    ),
    index("up_users_followers_lnk_ifk").using(
      "btree",
      table.followerId.asc().nullsLast().op("int4_ops")
    ),
    index("up_users_followers_lnk_ofk").using(
      "btree",
      table.followerOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [upUsers.id],
      name: "up_users_followers_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.followerId],
      foreignColumns: [followers.id],
      name: "up_users_followers_lnk_ifk",
    }).onDelete("cascade"),
    unique("up_users_followers_lnk_uq").on(table.userId, table.followerId),
  ]
);

export const strapiTransferTokenPermissions = pgTable(
  "strapi_transfer_token_permissions",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    action: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("strapi_transfer_token_permissions_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_transfer_token_permissions_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("strapi_transfer_token_permissions_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_transfer_token_permissions_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "strapi_transfer_token_permissions_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiTransferTokens = pgTable(
  "strapi_transfer_tokens",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    accessKey: varchar("access_key", { length: 255 }),
    lastUsedAt: timestamp("last_used_at", { precision: 6, mode: "string" }),
    expiresAt: timestamp("expires_at", { precision: 6, mode: "string" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    lifespan: bigint({ mode: "number" }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("strapi_transfer_tokens_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_transfer_tokens_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("strapi_transfer_tokens_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_transfer_tokens_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "strapi_transfer_tokens_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiWorkflowsStages = pgTable(
  "strapi_workflows_stages",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    color: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("strapi_workflows_stages_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_workflows_stages_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("strapi_workflows_stages_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_workflows_stages_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "strapi_workflows_stages_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiWorkflowsStagesWorkflowLnk = pgTable(
  "strapi_workflows_stages_workflow_lnk",
  {
    id: serial().primaryKey().notNull(),
    workflowStageId: integer("workflow_stage_id"),
    workflowId: integer("workflow_id"),
    workflowStageOrd: doublePrecision("workflow_stage_ord"),
  },
  (table) => [
    index("strapi_workflows_stages_workflow_lnk_fk").using(
      "btree",
      table.workflowStageId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_workflows_stages_workflow_lnk_ifk").using(
      "btree",
      table.workflowId.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_workflows_stages_workflow_lnk_oifk").using(
      "btree",
      table.workflowStageOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.workflowStageId],
      foreignColumns: [strapiWorkflowsStages.id],
      name: "strapi_workflows_stages_workflow_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.workflowId],
      foreignColumns: [strapiWorkflows.id],
      name: "strapi_workflows_stages_workflow_lnk_ifk",
    }).onDelete("cascade"),
    unique("strapi_workflows_stages_workflow_lnk_uq").on(
      table.workflowStageId,
      table.workflowId
    ),
  ]
);

export const upPermissions = pgTable(
  "up_permissions",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    action: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("up_permissions_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("up_permissions_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("up_permissions_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "up_permissions_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "up_permissions_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const upRoles = pgTable(
  "up_roles",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    type: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("up_roles_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("up_roles_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("up_roles_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "up_roles_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "up_roles_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const upUsersRoleLnk = pgTable(
  "up_users_role_lnk",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id"),
    roleId: integer("role_id"),
    userOrd: doublePrecision("user_ord"),
  },
  (table) => [
    index("up_users_role_lnk_fk").using(
      "btree",
      table.userId.asc().nullsLast().op("int4_ops")
    ),
    index("up_users_role_lnk_ifk").using(
      "btree",
      table.roleId.asc().nullsLast().op("int4_ops")
    ),
    index("up_users_role_lnk_oifk").using(
      "btree",
      table.userOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [upUsers.id],
      name: "up_users_role_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [upRoles.id],
      name: "up_users_role_lnk_ifk",
    }).onDelete("cascade"),
    unique("up_users_role_lnk_uq").on(table.userId, table.roleId),
  ]
);

export const uploadFoldersParentLnk = pgTable(
  "upload_folders_parent_lnk",
  {
    id: serial().primaryKey().notNull(),
    folderId: integer("folder_id"),
    invFolderId: integer("inv_folder_id"),
    folderOrd: doublePrecision("folder_ord"),
  },
  (table) => [
    index("upload_folders_parent_lnk_fk").using(
      "btree",
      table.folderId.asc().nullsLast().op("int4_ops")
    ),
    index("upload_folders_parent_lnk_ifk").using(
      "btree",
      table.invFolderId.asc().nullsLast().op("int4_ops")
    ),
    index("upload_folders_parent_lnk_oifk").using(
      "btree",
      table.folderOrd.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.folderId],
      foreignColumns: [uploadFolders.id],
      name: "upload_folders_parent_lnk_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.invFolderId],
      foreignColumns: [uploadFolders.id],
      name: "upload_folders_parent_lnk_ifk",
    }).onDelete("cascade"),
    unique("upload_folders_parent_lnk_uq").on(
      table.invFolderId,
      table.folderId
    ),
  ]
);

export const adminPermissions = pgTable(
  "admin_permissions",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    action: varchar({ length: 255 }),
    actionParameters: jsonb("action_parameters"),
    subject: varchar({ length: 255 }),
    properties: jsonb(),
    conditions: jsonb(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("admin_permissions_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("admin_permissions_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("admin_permissions_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "admin_permissions_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "admin_permissions_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const dashboardNavbars = pgTable(
  "dashboard_navbars",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("dashboard_navbars_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("dashboard_navbars_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("dashboard_navbars_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "dashboard_navbars_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "dashboard_navbars_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const uploadFolders = pgTable(
  "upload_folders",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    pathId: integer("path_id"),
    path: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("upload_folders_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("upload_folders_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("timestamp_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("upload_folders_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "upload_folders_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "upload_folders_updated_by_id_fk",
    }).onDelete("set null"),
    unique("upload_folders_path_id_index").on(table.pathId),
    unique("upload_folders_path_index").on(table.path),
  ]
);

export const filesRelatedMph = pgTable(
  "files_related_mph",
  {
    id: serial().primaryKey().notNull(),
    fileId: integer("file_id"),
    relatedId: integer("related_id"),
    relatedType: varchar("related_type", { length: 255 }),
    field: varchar({ length: 255 }),
    order: doublePrecision(),
  },
  (table) => [
    index("files_related_mph_fk").using(
      "btree",
      table.fileId.asc().nullsLast().op("int4_ops")
    ),
    index("files_related_mph_idix").using(
      "btree",
      table.relatedId.asc().nullsLast().op("int4_ops")
    ),
    index("files_related_mph_oidx").using(
      "btree",
      table.order.asc().nullsLast().op("float8_ops")
    ),
    foreignKey({
      columns: [table.fileId],
      foreignColumns: [files.id],
      name: "files_related_mph_fk",
    }).onDelete("cascade"),
  ]
);

export const i18NLocale = pgTable(
  "i18n_locale",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    name: varchar({ length: 255 }),
    code: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("i18n_locale_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("i18n_locale_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("i18n_locale_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "i18n_locale_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "i18n_locale_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const upUsers = pgTable(
  "up_users",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    username: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    provider: varchar({ length: 255 }),
    password: varchar({ length: 255 }),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    confirmationToken: varchar("confirmation_token", { length: 255 }),
    confirmed: boolean(),
    blocked: boolean(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("up_users_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("up_users_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("up_users_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "up_users_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "up_users_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const strapiApiTokenPermissions = pgTable(
  "strapi_api_token_permissions",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    action: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
  },
  (table) => [
    index("strapi_api_token_permissions_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("strapi_api_token_permissions_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("strapi_api_token_permissions_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "strapi_api_token_permissions_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "strapi_api_token_permissions_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);

export const followers = pgTable(
  "followers",
  {
    id: serial().primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    username: varchar({ length: 255 }),
    type: varchar({ length: 255 }),
    protected: boolean(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    createdById: integer("created_by_id"),
    updatedById: integer("updated_by_id"),
    locale: varchar({ length: 255 }),
    lastCheckedAt: timestamp("last_checked_at", {
      precision: 6,
      mode: "string",
    }),
    country: varchar({ length: 255 }),
    language: varchar({ length: 255 }),
    countryCode: varchar("country_code", { length: 255 }),
    languageCode: varchar("language_code", { length: 255 }),
    nickname: varchar({ length: 255 }),
    gender: varchar({ length: 255 }),
    pause: boolean(),
    description: text(),
    faq: jsonb(),
    category: varchar({ length: 255 }),
    tagline: varchar({ length: 255 }),
    migration: integer(),
    avatarUrl: text("avatar_url"),
  },
  (table) => [
    index("followers_created_by_id_fk").using(
      "btree",
      table.createdById.asc().nullsLast().op("int4_ops")
    ),
    index("followers_documents_idx").using(
      "btree",
      table.documentId.asc().nullsLast().op("text_ops"),
      table.locale.asc().nullsLast().op("text_ops"),
      table.publishedAt.asc().nullsLast().op("timestamp_ops")
    ),
    index("followers_updated_by_id_fk").using(
      "btree",
      table.updatedById.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.createdById],
      foreignColumns: [adminUsers.id],
      name: "followers_created_by_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.updatedById],
      foreignColumns: [adminUsers.id],
      name: "followers_updated_by_id_fk",
    }).onDelete("set null"),
  ]
);
