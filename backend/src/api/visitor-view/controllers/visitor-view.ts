/**
 * visitor-view controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::visitor-view.visitor-view",
  ({ strapi }) => ({
    async clearMine(ctx) {
      const userId = ctx.state.user?.id;
      if (!userId) return ctx.unauthorized();

      const result = await strapi.db.transaction(async () => {
        const views = await strapi.db
          .query("api::visitor-view.visitor-view")
          .deleteMany({ where: { user: userId } });
        const downloads = await strapi.db
          .query("api::visitor-download.visitor-download")
          .deleteMany({ where: { user: userId } });
        return {
          deletedViews: views?.count ?? 0,
          deletedDownloads: downloads?.count ?? 0,
        };
      });

      return { ok: true, ...result };
    },
  }),
);
