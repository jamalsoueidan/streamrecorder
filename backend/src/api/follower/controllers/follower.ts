import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::follower.follower",
  ({ strapi }) => ({
    async follow(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const { username, slug, type } = ctx.request.body;

      // Check if follower already exists
      let follower = await strapi
        .documents("api::follower.follower")
        .findFirst({
          filters: { slug },
        });

      // Create if doesn't exist
      if (!follower) {
        follower = await strapi.documents("api::follower.follower").create({
          data: { username, slug, type },
        });
      }

      // Connect to user
      await strapi.documents("plugin::users-permissions.user").update({
        documentId: user.documentId,
        data: {
          followers: {
            connect: [{ id: follower.id }],
          },
        },
      });

      return { data: follower };
    },
    async unfollow(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const { id } = ctx.params;

      await strapi.documents("plugin::users-permissions.user").update({
        documentId: user.documentId,
        data: {
          followers: {
            disconnect: [{ id: Number(id) }],
          },
        },
      });

      return { success: true };
    },
    async findForUser(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

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
