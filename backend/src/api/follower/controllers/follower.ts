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

      const { page = 1, pageSize = 20 } = ctx.query;

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: {
            followers: {
              fields: ["id", "username", "slug", "type"],
            },
          },
          status: "published",
        });

      if (!fullUser?.followers || fullUser.followers.length === 0) {
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

      const total = fullUser.followers.length;
      const offset = (Number(page) - 1) * Number(pageSize);
      const paginatedFollowers = fullUser.followers.slice(
        offset,
        offset + Number(pageSize)
      );

      const followersWithRecordings = await Promise.all(
        paginatedFollowers.map(async (follower) => {
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

      return {
        data: followersWithRecordings,
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

      // Get user's current followers (just IDs)
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

      const followingIds = fullUser?.followers?.map((f) => f.id) || [];

      const filters =
        followingIds.length > 0 ? { id: { $notIn: followingIds } } : {};

      // Get count for pagination
      const total = await strapi
        .documents("api::follower.follower")
        .count({ filters, status: "published" });

      // Get paginated followers
      const notFollowing = await strapi
        .documents("api::follower.follower")
        .findMany({
          filters,
          fields: ["id", "username", "slug", "type"],
          status: "published",
          sort: { username: "asc" },
          limit: Number(pageSize),
          offset: (Number(page) - 1) * Number(pageSize),
        });

      // Add recordings for each follower
      const followersWithRecordings = await Promise.all(
        notFollowing.map(async (follower) => {
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

      return {
        data: followersWithRecordings,
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
