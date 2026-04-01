/**
 * recording controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::recording.recording",
  ({ strapi }) => ({
    async browse(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const scope = ctx.query.scope as string | undefined;
      const favoritesOnly = ctx.query.favorites === "true";

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: {
            followers: { fields: ["id"] },
            favorites: { fields: ["id"] },
          },
          status: "published",
        });

      ctx.query.locale = ctx.query.locale || "en";

      const followingIds = fullUser?.followers?.map((f) => f.id) || [];
      const favoriteIds = fullUser?.favorites?.map((f) => f.id) || [];

      // Determine which follower IDs to filter by
      let followerIdFilter: object | null = null;

      if (favoritesOnly) {
        followerIdFilter = { $in: favoriteIds.length === 0 ? [0] : favoriteIds };
      } else if (scope === "following") {
        followerIdFilter = { $in: followingIds.length === 0 ? [0] : followingIds };
      } else if (scope === "discover" && followingIds.length > 0) {
        followerIdFilter = { $notIn: followingIds };
      }

      if (followerIdFilter) {
        const filters = (ctx.query.filters ?? {}) as Record<string, any>;

        ctx.query.filters = {
          ...filters,
          follower: {
            ...(filters.follower ?? {}),
            id: followerIdFilter,
          },
        };
      }

      return super.find(ctx);
    },
    async storageStats(ctx) {
      const knex = strapi.db.connection;

      const stats = (await knex("followers as f")
        .select(
          "f.type",
          knex.raw("COUNT(DISTINCT r.id) as total_recordings"),
          knex.raw("COUNT(DISTINCT s.id) as total_sources"),
          knex.raw(
            "COALESCE(SUM(CASE WHEN sc.field = 'videoOriginal' THEN CAST(cv.size_bytes AS BIGINT) ELSE 0 END), 0) as video_original_bytes",
          ),
          knex.raw(
            "COALESCE(SUM(CASE WHEN sc.field = 'videoSmall' THEN CAST(cv.size_bytes AS BIGINT) ELSE 0 END), 0) as video_small_bytes",
          ),
        )
        .leftJoin("recordings_follower_lnk as rfl", "rfl.follower_id", "f.id")
        .leftJoin("recordings as r", "r.id", "rfl.recording_id")
        .leftJoin("sources_recording_lnk as srl", "srl.recording_id", "r.id")
        .leftJoin("sources as s", "s.id", "srl.source_id")
        .leftJoin("sources_cmps as sc", "sc.entity_id", "s.id")
        .leftJoin("components_videos_videos as cv", "cv.id", "sc.cmp_id")
        .whereIn("f.type", [
          "pandalive",
          "youtube",
          "twitch",
          "tiktok",
          "afreecatv",
          "kick",
        ])
        .groupBy("f.type")
        .orderBy("f.type")) as any[];

      const totals = (await knex("followers as f")
        .select(
          knex.raw("COUNT(DISTINCT r.id) as total_recordings"),
          knex.raw("COUNT(DISTINCT s.id) as total_sources"),
          knex.raw(
            "COALESCE(SUM(CASE WHEN sc.field = 'videoOriginal' THEN CAST(cv.size_bytes AS BIGINT) ELSE 0 END), 0) as video_original_bytes",
          ),
          knex.raw(
            "COALESCE(SUM(CASE WHEN sc.field = 'videoSmall' THEN CAST(cv.size_bytes AS BIGINT) ELSE 0 END), 0) as video_small_bytes",
          ),
        )
        .leftJoin("recordings_follower_lnk as rfl", "rfl.follower_id", "f.id")
        .leftJoin("recordings as r", "r.id", "rfl.recording_id")
        .leftJoin("sources_recording_lnk as srl", "srl.recording_id", "r.id")
        .leftJoin("sources as s", "s.id", "srl.source_id")
        .leftJoin("sources_cmps as sc", "sc.entity_id", "s.id")
        .leftJoin("components_videos_videos as cv", "cv.id", "sc.cmp_id")
        .first()) as any;

      const formatBytes = (bytes: number | string | bigint) => {
        const num = Number(bytes);
        if (num >= 1e12) return `${(num / 1e12).toFixed(2)} TB`;
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)} GB`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)} MB`;
        return `${num} bytes`;
      };

      const data = stats.map((row) => ({
        type: row.type,
        totalRecordings: Number(row.total_recordings),
        totalSources: Number(row.total_sources),
        videoOriginal: {
          bytes: row.video_original_bytes.toString(),
          formatted: formatBytes(row.video_original_bytes),
        },
        videoSmall: {
          bytes: row.video_small_bytes.toString(),
          formatted: formatBytes(row.video_small_bytes),
        },
        total: {
          bytes: (
            BigInt(row.video_original_bytes) + BigInt(row.video_small_bytes)
          ).toString(),
          formatted: formatBytes(
            BigInt(row.video_original_bytes) + BigInt(row.video_small_bytes),
          ),
        },
      }));

      const totalOriginal = BigInt(totals?.video_original_bytes || 0);
      const totalSmall = BigInt(totals?.video_small_bytes || 0);

      return {
        data,
        totals: {
          totalRecordings: Number(totals?.total_recordings || 0),
          totalSources: Number(totals?.total_sources || 0),
          videoOriginal: formatBytes(totalOriginal),
          videoSmall: formatBytes(totalSmall),
          total: formatBytes(totalOriginal + totalSmall),
        },
      };
    },
  }),
);
