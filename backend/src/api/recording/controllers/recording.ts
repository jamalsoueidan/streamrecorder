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

      // Get user with followers using document service
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
        });

      const followers = fullUser?.followers;

      if (!followers || followers.length === 0) {
        return { data: [] };
      }

      // Get follower IDs
      const followerIds = followers.map((f) => f.id);

      // Get recordings for those followers
      const recordings = await strapi
        .documents("api::recording.recording")
        .findMany({
          filters: {
            follower: {
              id: { $in: followerIds },
            },
          },
          populate: ["sources", "follower"],
          sort: { createdAt: "desc" },
          limit: 20,
        });

      return { data: recordings };
    },
  })
);
