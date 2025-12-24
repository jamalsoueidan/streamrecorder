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
      if (recordingsPopulate) {
        delete (ctx.query.populate as any).recordings;
      }

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
            filters: {
              follower: { id: { $eq: follower.id } },
            },
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
              ...recordingsQuery,
              limit: undefined,
            }),
            recordingsPopulate
              ? strapi
                  .documents("api::recording.recording")
                  .findMany(recordingsQuery)
              : Promise.resolve(undefined),
          ]);

          return {
            ...follower,
            ...(recordings !== undefined && {
              recordings: recordings.filter((r) => r.sources?.length > 0),
            }),
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

      // Get current user with existing followers
      const currentUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          populate: ["followers"],
        });

      // Find or create follower
      let follower = await strapi
        .documents("api::follower.follower")
        .findFirst({
          filters: { username, type },
          status: "published",
        });

      if (!follower) {
        follower = await strapi.documents("api::follower.follower").create({
          data: { username, type },
          status: "published",
        });
      }

      // Get all existing documentIds + new one
      const existingDocIds =
        currentUser.followers?.map((f) => f.documentId) || [];

      if (!existingDocIds.includes(follower.documentId)) {
        existingDocIds.push(follower.documentId);
      }

      // Update with connect using documentIds
      const updatePayload = {
        documentId: user.documentId,
        data: {
          followers: {
            connect: existingDocIds,
          },
        },
      };

      await strapi
        .documents("plugin::users-permissions.user")
        .update(updatePayload);

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

      const { documentId } = ctx.params; // This should actually be documentId from frontend!

      const fullUser = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: user.documentId,
          populate: { followers: { fields: ["id", "documentId"] } },
        });

      // Find by documentId, not numeric id
      const followerToRemove = fullUser.followers?.find(
        (f) => f.documentId === documentId
      );

      if (!followerToRemove) {
        return ctx.notFound("You are not following this account");
      }

      await strapi.documents("plugin::users-permissions.user").update({
        documentId: user.documentId,
        data: {
          followers: {
            disconnect: [documentId],
          },
        },
      });

      return { success: true };
    },
    async bulkUpdateLastChecked(ctx) {
      const { documentIds } = ctx.request.body;

      const result = await strapi.db
        .query("api::follower.follower")
        .updateMany({
          where: { documentId: { $in: documentIds } },
          data: { lastCheckedAt: new Date() },
        });

      return {
        requested: documentIds.length,
        updated: result.count / 2, // each document have two rows in db
      };
    },
  })
);
