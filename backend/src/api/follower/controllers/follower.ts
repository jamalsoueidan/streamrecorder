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
          status: "published",
        });

      // Create if doesn't exist
      if (!follower) {
        follower = await strapi.documents("api::follower.follower").create({
          data: { username, slug, type },
          status: "published",
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
      const followerId = Number(id);

      // Get user with their followers
      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          status: "published",
          populate: { followers: { fields: ["id"] } },
        });

      // Check if user actually follows this follower
      const isFollowing = fullUser.followers?.some((f) => f.id === followerId);

      if (!isFollowing) {
        return ctx.notFound("You are not following this account");
      }

      await strapi.documents("plugin::users-permissions.user").update({
        documentId: user.documentId,
        data: {
          followers: {
            disconnect: [{ id: followerId }],
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
          status: "published",
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
              status: "published",
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
              status: "published",
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
