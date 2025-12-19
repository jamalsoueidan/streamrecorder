import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::follower.follower",
  ({ strapi }) => ({
    async find(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      // Extract and remove scope from query
      const scope = ctx.query.scope as string | undefined;
      delete ctx.query.scope;

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          fields: ["id"],
          populate: { followers: { fields: ["id"] } },
          status: "published",
        });

      const followingIds = fullUser?.followers?.map((f) => f.id) || [];

      // If scope is "FOLLOWING" and user follows no one, return empty result because [] will return all records
      if (scope === "following" && followingIds.length === 0) {
        return {
          data: [],
          meta: {
            pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 },
          },
        };
      }

      const scopeFilters: Record<string, object | null> = {
        following: { $in: followingIds },
        discover: followingIds.length > 0 ? { $notIn: followingIds } : null,
      };

      if (scope && scopeFilters[scope]) {
        Object.assign(ctx.query, {
          filters: Object.assign({}, ctx.query.filters, {
            id: scopeFilters[scope],
          }),
        });
      }

      const result = await super.find(ctx);

      const dataWithMeta = await Promise.all(
        result.data.map(async (follower) => {
          const totalRecordings = await strapi
            .documents("api::recording.recording")
            .count({
              filters: { follower: { id: { $eq: follower.id } } },
              status: "published",
            });

          return {
            ...follower,
            isFollowing: followingIds.includes(follower.id),
            totalRecordings,
          };
        })
      );

      return {
        data: dataWithMeta,
        meta: result.meta,
      };
    },

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
  })
);
