export default {
  async afterCreate(event: any) {
    const { result } = event;

    const view = await strapi.db
      .query("api::visitor-view.visitor-view")
      .findOne({
        where: { id: result.id },
        populate: { recording: { select: ["id"] } },
      });

    const recordingId = view?.recording?.id;
    if (!recordingId) return;

    await strapi.db.connection.raw(
      "UPDATE recordings SET views_count = COALESCE(views_count, 0) + 1 WHERE id = ?",
      [recordingId],
    );
  },
};
