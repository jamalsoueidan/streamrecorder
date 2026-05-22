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

      const viewResult = await strapi.db.connection.raw(
        `DELETE FROM visitor_views WHERE id IN (
          SELECT visitor_view_id FROM visitor_views_user_lnk WHERE user_id = ?
        )`,
        [userId],
      );

      const downloadResult = await strapi.db.connection.raw(
        `DELETE FROM visitor_downloads WHERE id IN (
          SELECT visitor_download_id FROM visitor_downloads_user_lnk WHERE user_id = ?
        )`,
        [userId],
      );

      return {
        ok: true,
        deletedViews: viewResult?.rowCount ?? 0,
        deletedDownloads: downloadResult?.rowCount ?? 0,
      };
    },
  }),
);
