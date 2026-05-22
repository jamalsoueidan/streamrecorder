export default {
  async afterCreate(event: any) {
    const rec = event?.params?.data?.recording;

    let recordingId: number | undefined;
    if (typeof rec === "number") {
      recordingId = rec;
    } else if (typeof rec === "string") {
      const found = await strapi.db
        .query("api::recording.recording")
        .findOne({ where: { documentId: rec }, select: ["id"] });
      recordingId = found?.id;
    } else {
      recordingId = rec?.set?.[0]?.id ?? rec?.connect?.[0]?.id;
    }

    if (!recordingId) return;

    await strapi.db.connection.raw(
      "UPDATE recordings SET views_count = COALESCE(views_count, 0) + 1 WHERE id = ?",
      [recordingId],
    );
  },
};
