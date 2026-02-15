/**
 * ai-request controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::ai-request.ai-request",
  ({ strapi }) => {
    const checkOwnership = async (documentId: string, userId: number) => {
      const aiRequest = await strapi
        .documents("api::ai-request.ai-request")
        .findOne({
          documentId,
          populate: { user: { fields: ["id"] } },
        });

      if (!aiRequest) return { error: "notFound" };
      if (aiRequest.user?.id !== userId) return { error: "forbidden" };
      return { aiRequest };
    };

    return {
      async meCreate(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        const data = ctx.request.body.data || {};
        const recordingId = data.recording;

        if (!recordingId) {
          return ctx.badRequest("Recording is required");
        }

        const recording = await strapi
          .documents("api::recording.recording")
          .findOne({
            documentId: recordingId,
            populate: { follower: { fields: ["documentId"] } },
          });

        if (!recording?.follower) {
          return ctx.badRequest("Recording or follower not found");
        }

        const aiRequest = await strapi
          .documents("api::ai-request.ai-request")
          .create({
            data: {
              ...data,
              recording: { connect: [recordingId] },
              user: { connect: [user.documentId] },
              follower: { connect: [recording.follower.documentId] },
            },
          });

        return { data: aiRequest };
      },

      async meFind(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        const { query } = ctx;
        const filters = {
          ...((query.filters as object) || {}),
          user: { documentId: user.documentId },
        };

        const results = await strapi
          .documents("api::ai-request.ai-request")
          .findMany({
            ...query,
            filters,
          });

        const total = await strapi.db
          .query("api::ai-request.ai-request")
          .count({ where: filters });

        const pagination = (query.pagination || {}) as Record<string, unknown>;
        const page = Number(pagination.page) || 1;
        const pageSize =
          Number(pagination.pageSize) || Number(pagination.limit) || 25;

        return {
          data: results,
          meta: {
            pagination: {
              page,
              pageSize,
              pageCount: Math.ceil(total / pageSize),
              total,
            },
          },
        };
      },

      async meFindOne(ctx) {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized();
        }

        const { id } = ctx.params;
        const check = await checkOwnership(id, user.id);

        if (check.error === "notFound") return ctx.notFound();
        if (check.error === "forbidden")
          return ctx.forbidden("You can only view your own");

        return super.findOne(ctx);
      },
    };
  },
);
