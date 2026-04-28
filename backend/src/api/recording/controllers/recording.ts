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
  }),
);
