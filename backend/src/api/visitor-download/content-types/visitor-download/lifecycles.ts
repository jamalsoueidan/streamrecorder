export default {
  async afterCreate(event: any) {
    const { result } = event;

    const download = await strapi.db
      .query("api::visitor-download.visitor-download")
      .findOne({
        where: { id: result.id },
        populate: { recording: { select: ["id"] } },
      });

    const recordingId = download?.recording?.id;
    if (!recordingId) return;

    await strapi.db.connection.raw(
      "UPDATE recordings SET downloads_count = COALESCE(downloads_count, 0) + 1 WHERE id = ?",
      [recordingId],
    );
  },
};
