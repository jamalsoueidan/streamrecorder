import { relations } from "drizzle-orm/relations";
import { adminPermissions, adminPermissionsRoleLnk, adminRoles, adminUsers, adminUsersRolesLnk, changeLogs, articles, files, filesFolderLnk, uploadFolders, messages, messagesUserLnk, upUsers, recordings, recordingsFollowerLnk, followers, sources, sourcesCmps, recordingsSourcesLnk, strapiApiTokenPermissions, strapiApiTokenPermissionsTokenLnk, strapiApiTokens, strapiHistoryVersions, strapiReleaseActions, strapiReleaseActionsReleaseLnk, strapiReleases, strapiSessions, strapiTransferTokenPermissions, strapiTransferTokenPermissionsTokenLnk, strapiTransferTokens, strapiWorkflows, strapiWorkflowsStageRequiredToPublishLnk, strapiWorkflowsStages, strapiWorkflowsStagesPermissionsLnk, upPermissions, upPermissionsRoleLnk, upRoles, upUsersFollowersLnk, strapiWorkflowsStagesWorkflowLnk, upUsersRoleLnk, uploadFoldersParentLnk, dashboardNavbars, filesRelatedMph, i18NLocale } from "./schema";

export const adminPermissionsRoleLnkRelations = relations(adminPermissionsRoleLnk, ({one}) => ({
	adminPermission: one(adminPermissions, {
		fields: [adminPermissionsRoleLnk.permissionId],
		references: [adminPermissions.id]
	}),
	adminRole: one(adminRoles, {
		fields: [adminPermissionsRoleLnk.roleId],
		references: [adminRoles.id]
	}),
}));

export const adminPermissionsRelations = relations(adminPermissions, ({one, many}) => ({
	adminPermissionsRoleLnks: many(adminPermissionsRoleLnk),
	strapiWorkflowsStagesPermissionsLnks: many(strapiWorkflowsStagesPermissionsLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [adminPermissions.createdById],
		references: [adminUsers.id],
		relationName: "adminPermissions_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [adminPermissions.updatedById],
		references: [adminUsers.id],
		relationName: "adminPermissions_updatedById_adminUsers_id"
	}),
}));

export const adminRolesRelations = relations(adminRoles, ({one, many}) => ({
	adminPermissionsRoleLnks: many(adminPermissionsRoleLnk),
	adminUsersRolesLnks: many(adminUsersRolesLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [adminRoles.createdById],
		references: [adminUsers.id],
		relationName: "adminRoles_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [adminRoles.updatedById],
		references: [adminUsers.id],
		relationName: "adminRoles_updatedById_adminUsers_id"
	}),
}));

export const adminUsersRolesLnkRelations = relations(adminUsersRolesLnk, ({one}) => ({
	adminUser: one(adminUsers, {
		fields: [adminUsersRolesLnk.userId],
		references: [adminUsers.id]
	}),
	adminRole: one(adminRoles, {
		fields: [adminUsersRolesLnk.roleId],
		references: [adminRoles.id]
	}),
}));

export const adminUsersRelations = relations(adminUsers, ({one, many}) => ({
	adminUsersRolesLnks: many(adminUsersRolesLnk),
	adminRoles_createdById: many(adminRoles, {
		relationName: "adminRoles_createdById_adminUsers_id"
	}),
	adminRoles_updatedById: many(adminRoles, {
		relationName: "adminRoles_updatedById_adminUsers_id"
	}),
	changeLogs_createdById: many(changeLogs, {
		relationName: "changeLogs_createdById_adminUsers_id"
	}),
	changeLogs_updatedById: many(changeLogs, {
		relationName: "changeLogs_updatedById_adminUsers_id"
	}),
	adminUser_createdById: one(adminUsers, {
		fields: [adminUsers.createdById],
		references: [adminUsers.id],
		relationName: "adminUsers_createdById_adminUsers_id"
	}),
	adminUsers_createdById: many(adminUsers, {
		relationName: "adminUsers_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [adminUsers.updatedById],
		references: [adminUsers.id],
		relationName: "adminUsers_updatedById_adminUsers_id"
	}),
	adminUsers_updatedById: many(adminUsers, {
		relationName: "adminUsers_updatedById_adminUsers_id"
	}),
	articles_createdById: many(articles, {
		relationName: "articles_createdById_adminUsers_id"
	}),
	articles_updatedById: many(articles, {
		relationName: "articles_updatedById_adminUsers_id"
	}),
	files_createdById: many(files, {
		relationName: "files_createdById_adminUsers_id"
	}),
	files_updatedById: many(files, {
		relationName: "files_updatedById_adminUsers_id"
	}),
	messages_createdById: many(messages, {
		relationName: "messages_createdById_adminUsers_id"
	}),
	messages_updatedById: many(messages, {
		relationName: "messages_updatedById_adminUsers_id"
	}),
	recordings_createdById: many(recordings, {
		relationName: "recordings_createdById_adminUsers_id"
	}),
	recordings_updatedById: many(recordings, {
		relationName: "recordings_updatedById_adminUsers_id"
	}),
	sources_createdById: many(sources, {
		relationName: "sources_createdById_adminUsers_id"
	}),
	sources_updatedById: many(sources, {
		relationName: "sources_updatedById_adminUsers_id"
	}),
	strapiHistoryVersions: many(strapiHistoryVersions),
	strapiReleaseActions_createdById: many(strapiReleaseActions, {
		relationName: "strapiReleaseActions_createdById_adminUsers_id"
	}),
	strapiReleaseActions_updatedById: many(strapiReleaseActions, {
		relationName: "strapiReleaseActions_updatedById_adminUsers_id"
	}),
	strapiSessions_createdById: many(strapiSessions, {
		relationName: "strapiSessions_createdById_adminUsers_id"
	}),
	strapiSessions_updatedById: many(strapiSessions, {
		relationName: "strapiSessions_updatedById_adminUsers_id"
	}),
	strapiApiTokens_createdById: many(strapiApiTokens, {
		relationName: "strapiApiTokens_createdById_adminUsers_id"
	}),
	strapiApiTokens_updatedById: many(strapiApiTokens, {
		relationName: "strapiApiTokens_updatedById_adminUsers_id"
	}),
	strapiReleases_createdById: many(strapiReleases, {
		relationName: "strapiReleases_createdById_adminUsers_id"
	}),
	strapiReleases_updatedById: many(strapiReleases, {
		relationName: "strapiReleases_updatedById_adminUsers_id"
	}),
	strapiWorkflows_createdById: many(strapiWorkflows, {
		relationName: "strapiWorkflows_createdById_adminUsers_id"
	}),
	strapiWorkflows_updatedById: many(strapiWorkflows, {
		relationName: "strapiWorkflows_updatedById_adminUsers_id"
	}),
	strapiTransferTokenPermissions_createdById: many(strapiTransferTokenPermissions, {
		relationName: "strapiTransferTokenPermissions_createdById_adminUsers_id"
	}),
	strapiTransferTokenPermissions_updatedById: many(strapiTransferTokenPermissions, {
		relationName: "strapiTransferTokenPermissions_updatedById_adminUsers_id"
	}),
	strapiTransferTokens_createdById: many(strapiTransferTokens, {
		relationName: "strapiTransferTokens_createdById_adminUsers_id"
	}),
	strapiTransferTokens_updatedById: many(strapiTransferTokens, {
		relationName: "strapiTransferTokens_updatedById_adminUsers_id"
	}),
	strapiWorkflowsStages_createdById: many(strapiWorkflowsStages, {
		relationName: "strapiWorkflowsStages_createdById_adminUsers_id"
	}),
	strapiWorkflowsStages_updatedById: many(strapiWorkflowsStages, {
		relationName: "strapiWorkflowsStages_updatedById_adminUsers_id"
	}),
	upPermissions_createdById: many(upPermissions, {
		relationName: "upPermissions_createdById_adminUsers_id"
	}),
	upPermissions_updatedById: many(upPermissions, {
		relationName: "upPermissions_updatedById_adminUsers_id"
	}),
	upRoles_createdById: many(upRoles, {
		relationName: "upRoles_createdById_adminUsers_id"
	}),
	upRoles_updatedById: many(upRoles, {
		relationName: "upRoles_updatedById_adminUsers_id"
	}),
	adminPermissions_createdById: many(adminPermissions, {
		relationName: "adminPermissions_createdById_adminUsers_id"
	}),
	adminPermissions_updatedById: many(adminPermissions, {
		relationName: "adminPermissions_updatedById_adminUsers_id"
	}),
	dashboardNavbars_createdById: many(dashboardNavbars, {
		relationName: "dashboardNavbars_createdById_adminUsers_id"
	}),
	dashboardNavbars_updatedById: many(dashboardNavbars, {
		relationName: "dashboardNavbars_updatedById_adminUsers_id"
	}),
	uploadFolders_createdById: many(uploadFolders, {
		relationName: "uploadFolders_createdById_adminUsers_id"
	}),
	uploadFolders_updatedById: many(uploadFolders, {
		relationName: "uploadFolders_updatedById_adminUsers_id"
	}),
	i18NLocales_createdById: many(i18NLocale, {
		relationName: "i18NLocale_createdById_adminUsers_id"
	}),
	i18NLocales_updatedById: many(i18NLocale, {
		relationName: "i18NLocale_updatedById_adminUsers_id"
	}),
	upUsers_createdById: many(upUsers, {
		relationName: "upUsers_createdById_adminUsers_id"
	}),
	upUsers_updatedById: many(upUsers, {
		relationName: "upUsers_updatedById_adminUsers_id"
	}),
	strapiApiTokenPermissions_createdById: many(strapiApiTokenPermissions, {
		relationName: "strapiApiTokenPermissions_createdById_adminUsers_id"
	}),
	strapiApiTokenPermissions_updatedById: many(strapiApiTokenPermissions, {
		relationName: "strapiApiTokenPermissions_updatedById_adminUsers_id"
	}),
	followers_createdById: many(followers, {
		relationName: "followers_createdById_adminUsers_id"
	}),
	followers_updatedById: many(followers, {
		relationName: "followers_updatedById_adminUsers_id"
	}),
}));

export const changeLogsRelations = relations(changeLogs, ({one}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [changeLogs.createdById],
		references: [adminUsers.id],
		relationName: "changeLogs_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [changeLogs.updatedById],
		references: [adminUsers.id],
		relationName: "changeLogs_updatedById_adminUsers_id"
	}),
}));

export const articlesRelations = relations(articles, ({one}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [articles.createdById],
		references: [adminUsers.id],
		relationName: "articles_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [articles.updatedById],
		references: [adminUsers.id],
		relationName: "articles_updatedById_adminUsers_id"
	}),
}));

export const filesRelations = relations(files, ({one, many}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [files.createdById],
		references: [adminUsers.id],
		relationName: "files_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [files.updatedById],
		references: [adminUsers.id],
		relationName: "files_updatedById_adminUsers_id"
	}),
	filesFolderLnks: many(filesFolderLnk),
	filesRelatedMphs: many(filesRelatedMph),
}));

export const filesFolderLnkRelations = relations(filesFolderLnk, ({one}) => ({
	file: one(files, {
		fields: [filesFolderLnk.fileId],
		references: [files.id]
	}),
	uploadFolder: one(uploadFolders, {
		fields: [filesFolderLnk.folderId],
		references: [uploadFolders.id]
	}),
}));

export const uploadFoldersRelations = relations(uploadFolders, ({one, many}) => ({
	filesFolderLnks: many(filesFolderLnk),
	uploadFoldersParentLnks_folderId: many(uploadFoldersParentLnk, {
		relationName: "uploadFoldersParentLnk_folderId_uploadFolders_id"
	}),
	uploadFoldersParentLnks_invFolderId: many(uploadFoldersParentLnk, {
		relationName: "uploadFoldersParentLnk_invFolderId_uploadFolders_id"
	}),
	adminUser_createdById: one(adminUsers, {
		fields: [uploadFolders.createdById],
		references: [adminUsers.id],
		relationName: "uploadFolders_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [uploadFolders.updatedById],
		references: [adminUsers.id],
		relationName: "uploadFolders_updatedById_adminUsers_id"
	}),
}));

export const messagesRelations = relations(messages, ({one, many}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [messages.createdById],
		references: [adminUsers.id],
		relationName: "messages_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [messages.updatedById],
		references: [adminUsers.id],
		relationName: "messages_updatedById_adminUsers_id"
	}),
	messagesUserLnks: many(messagesUserLnk),
}));

export const messagesUserLnkRelations = relations(messagesUserLnk, ({one}) => ({
	message: one(messages, {
		fields: [messagesUserLnk.messageId],
		references: [messages.id]
	}),
	upUser: one(upUsers, {
		fields: [messagesUserLnk.userId],
		references: [upUsers.id]
	}),
}));

export const upUsersRelations = relations(upUsers, ({one, many}) => ({
	messagesUserLnks: many(messagesUserLnk),
	upUsersFollowersLnks: many(upUsersFollowersLnk),
	upUsersRoleLnks: many(upUsersRoleLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [upUsers.createdById],
		references: [adminUsers.id],
		relationName: "upUsers_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [upUsers.updatedById],
		references: [adminUsers.id],
		relationName: "upUsers_updatedById_adminUsers_id"
	}),
}));

export const recordingsRelations = relations(recordings, ({one, many}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [recordings.createdById],
		references: [adminUsers.id],
		relationName: "recordings_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [recordings.updatedById],
		references: [adminUsers.id],
		relationName: "recordings_updatedById_adminUsers_id"
	}),
	recordingsFollowerLnks: many(recordingsFollowerLnk),
	recordingsSourcesLnks: many(recordingsSourcesLnk),
}));

export const recordingsFollowerLnkRelations = relations(recordingsFollowerLnk, ({one}) => ({
	recording: one(recordings, {
		fields: [recordingsFollowerLnk.recordingId],
		references: [recordings.id]
	}),
	follower: one(followers, {
		fields: [recordingsFollowerLnk.followerId],
		references: [followers.id]
	}),
}));

export const followersRelations = relations(followers, ({one, many}) => ({
	recordingsFollowerLnks: many(recordingsFollowerLnk),
	upUsersFollowersLnks: many(upUsersFollowersLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [followers.createdById],
		references: [adminUsers.id],
		relationName: "followers_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [followers.updatedById],
		references: [adminUsers.id],
		relationName: "followers_updatedById_adminUsers_id"
	}),
}));

export const sourcesCmpsRelations = relations(sourcesCmps, ({one}) => ({
	source: one(sources, {
		fields: [sourcesCmps.entityId],
		references: [sources.id]
	}),
}));

export const sourcesRelations = relations(sources, ({one, many}) => ({
	sourcesCmps: many(sourcesCmps),
	recordingsSourcesLnks: many(recordingsSourcesLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [sources.createdById],
		references: [adminUsers.id],
		relationName: "sources_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [sources.updatedById],
		references: [adminUsers.id],
		relationName: "sources_updatedById_adminUsers_id"
	}),
}));

export const recordingsSourcesLnkRelations = relations(recordingsSourcesLnk, ({one}) => ({
	recording: one(recordings, {
		fields: [recordingsSourcesLnk.recordingId],
		references: [recordings.id]
	}),
	source: one(sources, {
		fields: [recordingsSourcesLnk.sourceId],
		references: [sources.id]
	}),
}));

export const strapiApiTokenPermissionsTokenLnkRelations = relations(strapiApiTokenPermissionsTokenLnk, ({one}) => ({
	strapiApiTokenPermission: one(strapiApiTokenPermissions, {
		fields: [strapiApiTokenPermissionsTokenLnk.apiTokenPermissionId],
		references: [strapiApiTokenPermissions.id]
	}),
	strapiApiToken: one(strapiApiTokens, {
		fields: [strapiApiTokenPermissionsTokenLnk.apiTokenId],
		references: [strapiApiTokens.id]
	}),
}));

export const strapiApiTokenPermissionsRelations = relations(strapiApiTokenPermissions, ({one, many}) => ({
	strapiApiTokenPermissionsTokenLnks: many(strapiApiTokenPermissionsTokenLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [strapiApiTokenPermissions.createdById],
		references: [adminUsers.id],
		relationName: "strapiApiTokenPermissions_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [strapiApiTokenPermissions.updatedById],
		references: [adminUsers.id],
		relationName: "strapiApiTokenPermissions_updatedById_adminUsers_id"
	}),
}));

export const strapiApiTokensRelations = relations(strapiApiTokens, ({one, many}) => ({
	strapiApiTokenPermissionsTokenLnks: many(strapiApiTokenPermissionsTokenLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [strapiApiTokens.createdById],
		references: [adminUsers.id],
		relationName: "strapiApiTokens_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [strapiApiTokens.updatedById],
		references: [adminUsers.id],
		relationName: "strapiApiTokens_updatedById_adminUsers_id"
	}),
}));

export const strapiHistoryVersionsRelations = relations(strapiHistoryVersions, ({one}) => ({
	adminUser: one(adminUsers, {
		fields: [strapiHistoryVersions.createdById],
		references: [adminUsers.id]
	}),
}));

export const strapiReleaseActionsRelations = relations(strapiReleaseActions, ({one, many}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [strapiReleaseActions.createdById],
		references: [adminUsers.id],
		relationName: "strapiReleaseActions_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [strapiReleaseActions.updatedById],
		references: [adminUsers.id],
		relationName: "strapiReleaseActions_updatedById_adminUsers_id"
	}),
	strapiReleaseActionsReleaseLnks: many(strapiReleaseActionsReleaseLnk),
}));

export const strapiReleaseActionsReleaseLnkRelations = relations(strapiReleaseActionsReleaseLnk, ({one}) => ({
	strapiReleaseAction: one(strapiReleaseActions, {
		fields: [strapiReleaseActionsReleaseLnk.releaseActionId],
		references: [strapiReleaseActions.id]
	}),
	strapiRelease: one(strapiReleases, {
		fields: [strapiReleaseActionsReleaseLnk.releaseId],
		references: [strapiReleases.id]
	}),
}));

export const strapiReleasesRelations = relations(strapiReleases, ({one, many}) => ({
	strapiReleaseActionsReleaseLnks: many(strapiReleaseActionsReleaseLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [strapiReleases.createdById],
		references: [adminUsers.id],
		relationName: "strapiReleases_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [strapiReleases.updatedById],
		references: [adminUsers.id],
		relationName: "strapiReleases_updatedById_adminUsers_id"
	}),
}));

export const strapiSessionsRelations = relations(strapiSessions, ({one}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [strapiSessions.createdById],
		references: [adminUsers.id],
		relationName: "strapiSessions_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [strapiSessions.updatedById],
		references: [adminUsers.id],
		relationName: "strapiSessions_updatedById_adminUsers_id"
	}),
}));

export const strapiTransferTokenPermissionsTokenLnkRelations = relations(strapiTransferTokenPermissionsTokenLnk, ({one}) => ({
	strapiTransferTokenPermission: one(strapiTransferTokenPermissions, {
		fields: [strapiTransferTokenPermissionsTokenLnk.transferTokenPermissionId],
		references: [strapiTransferTokenPermissions.id]
	}),
	strapiTransferToken: one(strapiTransferTokens, {
		fields: [strapiTransferTokenPermissionsTokenLnk.transferTokenId],
		references: [strapiTransferTokens.id]
	}),
}));

export const strapiTransferTokenPermissionsRelations = relations(strapiTransferTokenPermissions, ({one, many}) => ({
	strapiTransferTokenPermissionsTokenLnks: many(strapiTransferTokenPermissionsTokenLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [strapiTransferTokenPermissions.createdById],
		references: [adminUsers.id],
		relationName: "strapiTransferTokenPermissions_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [strapiTransferTokenPermissions.updatedById],
		references: [adminUsers.id],
		relationName: "strapiTransferTokenPermissions_updatedById_adminUsers_id"
	}),
}));

export const strapiTransferTokensRelations = relations(strapiTransferTokens, ({one, many}) => ({
	strapiTransferTokenPermissionsTokenLnks: many(strapiTransferTokenPermissionsTokenLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [strapiTransferTokens.createdById],
		references: [adminUsers.id],
		relationName: "strapiTransferTokens_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [strapiTransferTokens.updatedById],
		references: [adminUsers.id],
		relationName: "strapiTransferTokens_updatedById_adminUsers_id"
	}),
}));

export const strapiWorkflowsRelations = relations(strapiWorkflows, ({one, many}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [strapiWorkflows.createdById],
		references: [adminUsers.id],
		relationName: "strapiWorkflows_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [strapiWorkflows.updatedById],
		references: [adminUsers.id],
		relationName: "strapiWorkflows_updatedById_adminUsers_id"
	}),
	strapiWorkflowsStageRequiredToPublishLnks: many(strapiWorkflowsStageRequiredToPublishLnk),
	strapiWorkflowsStagesWorkflowLnks: many(strapiWorkflowsStagesWorkflowLnk),
}));

export const strapiWorkflowsStageRequiredToPublishLnkRelations = relations(strapiWorkflowsStageRequiredToPublishLnk, ({one}) => ({
	strapiWorkflow: one(strapiWorkflows, {
		fields: [strapiWorkflowsStageRequiredToPublishLnk.workflowId],
		references: [strapiWorkflows.id]
	}),
	strapiWorkflowsStage: one(strapiWorkflowsStages, {
		fields: [strapiWorkflowsStageRequiredToPublishLnk.workflowStageId],
		references: [strapiWorkflowsStages.id]
	}),
}));

export const strapiWorkflowsStagesRelations = relations(strapiWorkflowsStages, ({one, many}) => ({
	strapiWorkflowsStageRequiredToPublishLnks: many(strapiWorkflowsStageRequiredToPublishLnk),
	strapiWorkflowsStagesPermissionsLnks: many(strapiWorkflowsStagesPermissionsLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [strapiWorkflowsStages.createdById],
		references: [adminUsers.id],
		relationName: "strapiWorkflowsStages_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [strapiWorkflowsStages.updatedById],
		references: [adminUsers.id],
		relationName: "strapiWorkflowsStages_updatedById_adminUsers_id"
	}),
	strapiWorkflowsStagesWorkflowLnks: many(strapiWorkflowsStagesWorkflowLnk),
}));

export const strapiWorkflowsStagesPermissionsLnkRelations = relations(strapiWorkflowsStagesPermissionsLnk, ({one}) => ({
	strapiWorkflowsStage: one(strapiWorkflowsStages, {
		fields: [strapiWorkflowsStagesPermissionsLnk.workflowStageId],
		references: [strapiWorkflowsStages.id]
	}),
	adminPermission: one(adminPermissions, {
		fields: [strapiWorkflowsStagesPermissionsLnk.permissionId],
		references: [adminPermissions.id]
	}),
}));

export const upPermissionsRoleLnkRelations = relations(upPermissionsRoleLnk, ({one}) => ({
	upPermission: one(upPermissions, {
		fields: [upPermissionsRoleLnk.permissionId],
		references: [upPermissions.id]
	}),
	upRole: one(upRoles, {
		fields: [upPermissionsRoleLnk.roleId],
		references: [upRoles.id]
	}),
}));

export const upPermissionsRelations = relations(upPermissions, ({one, many}) => ({
	upPermissionsRoleLnks: many(upPermissionsRoleLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [upPermissions.createdById],
		references: [adminUsers.id],
		relationName: "upPermissions_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [upPermissions.updatedById],
		references: [adminUsers.id],
		relationName: "upPermissions_updatedById_adminUsers_id"
	}),
}));

export const upRolesRelations = relations(upRoles, ({one, many}) => ({
	upPermissionsRoleLnks: many(upPermissionsRoleLnk),
	adminUser_createdById: one(adminUsers, {
		fields: [upRoles.createdById],
		references: [adminUsers.id],
		relationName: "upRoles_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [upRoles.updatedById],
		references: [adminUsers.id],
		relationName: "upRoles_updatedById_adminUsers_id"
	}),
	upUsersRoleLnks: many(upUsersRoleLnk),
}));

export const upUsersFollowersLnkRelations = relations(upUsersFollowersLnk, ({one}) => ({
	upUser: one(upUsers, {
		fields: [upUsersFollowersLnk.userId],
		references: [upUsers.id]
	}),
	follower: one(followers, {
		fields: [upUsersFollowersLnk.followerId],
		references: [followers.id]
	}),
}));

export const strapiWorkflowsStagesWorkflowLnkRelations = relations(strapiWorkflowsStagesWorkflowLnk, ({one}) => ({
	strapiWorkflowsStage: one(strapiWorkflowsStages, {
		fields: [strapiWorkflowsStagesWorkflowLnk.workflowStageId],
		references: [strapiWorkflowsStages.id]
	}),
	strapiWorkflow: one(strapiWorkflows, {
		fields: [strapiWorkflowsStagesWorkflowLnk.workflowId],
		references: [strapiWorkflows.id]
	}),
}));

export const upUsersRoleLnkRelations = relations(upUsersRoleLnk, ({one}) => ({
	upUser: one(upUsers, {
		fields: [upUsersRoleLnk.userId],
		references: [upUsers.id]
	}),
	upRole: one(upRoles, {
		fields: [upUsersRoleLnk.roleId],
		references: [upRoles.id]
	}),
}));

export const uploadFoldersParentLnkRelations = relations(uploadFoldersParentLnk, ({one}) => ({
	uploadFolder_folderId: one(uploadFolders, {
		fields: [uploadFoldersParentLnk.folderId],
		references: [uploadFolders.id],
		relationName: "uploadFoldersParentLnk_folderId_uploadFolders_id"
	}),
	uploadFolder_invFolderId: one(uploadFolders, {
		fields: [uploadFoldersParentLnk.invFolderId],
		references: [uploadFolders.id],
		relationName: "uploadFoldersParentLnk_invFolderId_uploadFolders_id"
	}),
}));

export const dashboardNavbarsRelations = relations(dashboardNavbars, ({one}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [dashboardNavbars.createdById],
		references: [adminUsers.id],
		relationName: "dashboardNavbars_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [dashboardNavbars.updatedById],
		references: [adminUsers.id],
		relationName: "dashboardNavbars_updatedById_adminUsers_id"
	}),
}));

export const filesRelatedMphRelations = relations(filesRelatedMph, ({one}) => ({
	file: one(files, {
		fields: [filesRelatedMph.fileId],
		references: [files.id]
	}),
}));

export const i18NLocaleRelations = relations(i18NLocale, ({one}) => ({
	adminUser_createdById: one(adminUsers, {
		fields: [i18NLocale.createdById],
		references: [adminUsers.id],
		relationName: "i18NLocale_createdById_adminUsers_id"
	}),
	adminUser_updatedById: one(adminUsers, {
		fields: [i18NLocale.updatedById],
		references: [adminUsers.id],
		relationName: "i18NLocale_updatedById_adminUsers_id"
	}),
}));