import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::clip.clip",
  ({ strapi }) => ({
    async shuffle(ctx) {
      console.log("RANDOM HIT");
      const limit = ctx.query.limit || 12;

      const clips = await strapi.documents("api::clip.clip").findMany({
        limit: 100,
        populate: {
          follower: {
            fields: "documentId",
          },
        },
      });

      const shuffled = clips.sort(() => Math.random() - 0.5);

      const seen = new Set<string>();
      const unique: typeof clips = [];
      for (const clip of shuffled) {
        const userId = clip.follower?.documentId;
        if (userId && !seen.has(userId)) {
          seen.add(userId);
          unique.push(clip);
          if (unique.length >= (limit as number)) break;
        }
      }

      return { data: unique };
    },
  }),
);
