export default {
  async afterCreate(event: any) {
    const rec = event?.params?.data?.recording;
    const recordingId =
      typeof rec === "number"
        ? rec
        : rec?.set?.[0]?.id ?? rec?.connect?.[0]?.id;

    console.log("[visitor-view.afterCreate] recordingId:", recordingId);

    if (!recordingId) return;

    const result = await strapi.db.connection.raw(
      "UPDATE recordings SET views_count = COALESCE(views_count, 0) + 1 WHERE id = ?",
      [recordingId],
    );

    console.log(
      "[visitor-view.afterCreate] updated rows:",
      result?.rowCount ?? "unknown",
    );
  },
};
