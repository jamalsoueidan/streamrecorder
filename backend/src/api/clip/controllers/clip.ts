import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::clip.clip",
  ({ strapi }) => ({
    async shuffle(ctx) {
      console.log("RANDOM HIT");
      const limit = ctx.query.limit || 12;
      const maxPerUser = 1;

      const clips = await strapi.documents("api::clip.clip").findMany({
        limit: 100,
        populate: {
          follower: {
            fields: "documentId",
          },
        },
      });

      const shuffled = clips.sort(() => Math.random() - 0.5);

      const userCount = new Map<string, number>();
      const result: typeof clips = [];

      for (const clip of shuffled) {
        const userId = clip.follower?.documentId;
        if (userId) {
          const count = userCount.get(userId) || 0;
          if (count < maxPerUser) {
            userCount.set(userId, count + 1);
            result.push(clip);
            if (result.length >= (limit as number)) break;
          }
        }
      }

      return { data: result };
    },
  }),
);
