import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::follower.follower",
  ({ strapi }) => ({
    async findForUser(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in");
      }

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: {
            followers: {
              fields: ["id", "username", "slug"],
            },
          },
        });

      if (!fullUser?.followers || fullUser.followers.length === 0) {
        return { data: [] };
      }

      const followersWithRecordings = await Promise.all(
        fullUser.followers.map(async (follower) => {
          // Get total count
          const totalRecordings = await strapi
            .documents("api::recording.recording")
            .count({
              filters: {
                follower: {
                  id: { $eq: follower.id },
                },
              },
            });

          // Get latest 5 recordings
          const recordings = await strapi
            .documents("api::recording.recording")
            .findMany({
              filters: {
                follower: {
                  id: { $eq: follower.id },
                },
              },
              populate: {
                sources: {},
              },
              sort: { createdAt: "desc" },
              limit: 5,
            });

          return {
            ...follower,
            totalRecordings,
            recordings,
          };
        })
      );

      return { data: followersWithRecordings };
    },
  })
);
