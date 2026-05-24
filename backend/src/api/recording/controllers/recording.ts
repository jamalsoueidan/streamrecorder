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

      const populateFields: Record<string, { fields: string[] }> = {
        followers: { fields: ["id"] },
      };
      if (favoritesOnly) {
        populateFields.favorites = { fields: ["id"] };
      }

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: populateFields,
          status: "published",
        });

      ctx.query.locale = ctx.query.locale || "en";

      const followingIds =
        (fullUser as any)?.followers?.map((f: any) => f.id) || [];
      const favoriteIds = favoritesOnly
        ? (fullUser as any)?.favorites?.map((f: any) => f.id) || []
        : [];

      // Determine which follower IDs to filter by
      let followerIdFilter: object | null = null;

      if (favoritesOnly) {
        followerIdFilter = {
          $in: favoriteIds.length === 0 ? [0] : favoriteIds,
        };
      } else if (scope === "following") {
        followerIdFilter = {
          $in: followingIds.length === 0 ? [0] : followingIds,
        };
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
    async search(ctx) {
      const body = (ctx.request.body as any) || {};
      const page = Number(body.pagination?.page ?? 1);
      const pageSize = Number(body.pagination?.pageSize ?? 25);
      const withCount = body.pagination?.withCount !== false;

      const [data, total] = await Promise.all([
        strapi.documents("api::recording.recording").findMany({
          filters: body.filters,
          sort: body.sort,
          populate: body.populate,
          fields: body.fields,
          locale: body.locale ?? "en",
          status: "published",
          start: (page - 1) * pageSize,
          limit: pageSize,
        }),
        withCount
          ? strapi.documents("api::recording.recording").count({
              filters: body.filters,
              locale: body.locale ?? "en",
              status: "published",
            })
          : Promise.resolve(0),
      ]);

      return {
        data,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: withCount ? Math.ceil(total / pageSize) : 0,
            total: withCount ? total : 0,
          },
        },
      };
    },
    async report(ctx) {
      const { documentId } = ctx.params;
      const { reason, locale, reporter } = (ctx.request.body as any) || {};

      const ALLOWED = new Set([
        "sexual",
        "violent",
        "hateful",
        "harmful",
        "spam",
      ]);
      if (
        !documentId ||
        typeof reason !== "string" ||
        !ALLOWED.has(reason) ||
        !reporter?.id ||
        !reporter?.email
      ) {
        return ctx.badRequest("INVALID_REPORT");
      }

      const recording = await strapi
        .documents("api::recording.recording")
        .findOne({
          documentId,
          populate: { follower: { fields: ["username", "type"] } },
        });

      if (!recording) return ctx.notFound("RECORDING_NOT_FOUND");

      const follower = (recording as any).follower;
      const localePrefix = locale && locale !== "en" ? `${locale}/` : "";
      const videoUrl = follower
        ? `https://www.livestreamrecorder.com/${localePrefix}${follower.type}/${follower.username}/video/${documentId}`
        : `https://www.livestreamrecorder.com/video/${documentId}`;

      const emailSettings = strapi.plugin("email").config("settings") as {
        defaultTo?: string;
        defaultFrom?: string;
      };

      const reasonLabels: Record<string, string> = {
        sexual: "Sexual content",
        violent: "Violent or repulsive content",
        hateful: "Hateful or abusive content",
        harmful: "Harmful or dangerous acts",
        spam: "Spam or misleading",
      };

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: emailSettings.defaultFrom,
            to: emailSettings.defaultTo,
            subject: `Report: ${reasonLabels[reason]} — ${follower?.username ?? "unknown"}`,
            html: `
              <p><strong>Reason:</strong> ${reasonLabels[reason]}</p>
              <p><strong>Video:</strong> <a href="${videoUrl}">${videoUrl}</a></p>
              <p><strong>Creator:</strong> ${follower?.username ?? "unknown"} (${follower?.type ?? "?"})</p>
              <hr/>
              <p><strong>Reported by:</strong> ${reporter.username} (${reporter.email})</p>
              <p><strong>User ID:</strong> ${reporter.id}</p>
            `,
            reply_to: reporter.email,
          }),
        });
      } catch (error) {
        strapi.log.error("Report email send error:", error);
        return ctx.internalServerError("Failed to send report");
      }

      return { success: true };
    },
    async resetCounters(ctx) {
      const { documentId } = ctx.params;
      if (!documentId || typeof documentId !== "string") {
        return ctx.badRequest("INVALID_DOCUMENT_ID");
      }

      await strapi.db.connection.raw(
        "UPDATE recordings SET views_count = 0, downloads_count = 0 WHERE document_id = ?",
        [documentId],
      );

      return { success: true };
    },
  }),
);
