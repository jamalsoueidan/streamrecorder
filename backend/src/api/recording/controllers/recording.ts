/**
 * recording controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::recording.recording",
  ({ strapi }) => ({
    async findForUser(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const { page = 1, pageSize = 20 } = ctx.query;

      // Get user's follower IDs only
      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: {
            followers: {
              fields: ["id"],
            },
          },
          status: "published",
        });

      const followers = fullUser?.followers;

      if (!followers || followers.length === 0) {
        return {
          data: [],
          meta: {
            pagination: {
              page: Number(page),
              pageSize: Number(pageSize),
              pageCount: 0,
              total: 0,
            },
          },
        };
      }

      const followerIds = followers.map((f) => f.id);

      const filters = {
        follower: {
          id: { $in: followerIds },
        },
      };

      // Get total count
      const total = await strapi
        .documents("api::recording.recording")
        .count({ filters, status: "published" });

      // Get paginated recordings
      const recordings = await strapi
        .documents("api::recording.recording")
        .findMany({
          filters,
          populate: {
            sources: {},
            follower: {},
          },
          sort: { createdAt: "desc" },
          limit: Number(pageSize),
          offset: (Number(page) - 1) * Number(pageSize),
          status: "published",
        });

      return {
        data: recordings,
        meta: {
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            pageCount: Math.ceil(total / Number(pageSize)),
            total,
          },
        },
      };
    },

    async findNotFollowing(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const { page = 1, pageSize = 20 } = ctx.query;

      // Get user's follower IDs only
      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: {
            followers: {
              fields: ["id"],
            },
          },
          status: "published",
        });

      const followerIds = fullUser?.followers?.map((f) => f.id) || [];

      // Get recordings from followers user is NOT following
      const filters =
        followerIds.length > 0
          ? {
              follower: {
                id: { $notIn: followerIds },
              },
            }
          : {};

      // Get total count
      const total = await strapi
        .documents("api::recording.recording")
        .count({ filters, status: "published" });

      // Get paginated recordings
      const recordings = await strapi
        .documents("api::recording.recording")
        .findMany({
          filters,
          populate: {
            sources: {},
            follower: {},
          },
          sort: { createdAt: "desc" },
          limit: Number(pageSize),
          offset: (Number(page) - 1) * Number(pageSize),
          status: "published",
        });

      return {
        data: recordings,
        meta: {
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            pageCount: Math.ceil(total / Number(pageSize)),
            total,
          },
        },
      };
    },
  })
);
