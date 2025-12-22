import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::follower.follower",
  ({ strapi }) => ({
    async browse(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      // Extract and remove scope from query
      const scope = ctx.query.scope as string | undefined;
      const hasRecordings = ctx.query.hasRecordings === "true";

      delete ctx.query.scope;
      delete ctx.query.hasRecordings;

      // Extract and remove recordings populate config
      const recordingsPopulate = (ctx.query.populate as any)?.recordings;
      delete ctx.query.populate;

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

      if (hasRecordings) {
        Object.assign(ctx.query, {
          filters: Object.assign({}, ctx.query.filters, {
            recordings: { id: { $notNull: true } },
          }),
        });
      }

      const result = await super.find(ctx);

      const dataWithMeta = await Promise.all(
        result.data.map(async (follower) => {
          // Build recordings query, mimicking frontend populate
          const recordingsQuery: any = {
            filters: { follower: { id: { $eq: follower.id } } },
            status: "published",
            limit: 5,
            sort: { createdAt: "desc" },
          };

          // Apply nested populate if it was requested
          if (recordingsPopulate?.populate) {
            recordingsQuery.populate = recordingsPopulate.populate;
          }

          const [totalRecordings, recordings] = await Promise.all([
            strapi.documents("api::recording.recording").count({
              filters: { follower: { id: { $eq: follower.id } } },
              status: "published",
            }),
            recordingsPopulate
              ? strapi
                  .documents("api::recording.recording")
                  .findMany(recordingsQuery)
              : Promise.resolve(undefined),
          ]);

          return {
            ...follower,
            ...(recordings !== undefined && { recordings }),
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

      const { username, type } = ctx.request.body;

      // Check if follower already exists
      let follower = await strapi
        .documents("api::follower.follower")
        .findFirst({
          filters: { username, type },
          status: "published",
        });

      // Create if doesn't exist
      if (!follower) {
        follower = await strapi.documents("api::follower.follower").create({
          data: { username, type },
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
    async import(ctx) {
      const { username, type, createdAt } = ctx.request.body;

      if (!username) {
        return ctx.badRequest("username is required");
      }

      const result = await strapi.documents("api::follower.follower").create({
        data: {
          username,
          type,
          createdAt: createdAt || new Date(),
        },
        status: "published",
      });

      ctx.body = { data: result };
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
