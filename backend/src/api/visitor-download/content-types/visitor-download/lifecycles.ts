export default {
  async afterCreate(event: any) {
    const rec = event?.params?.data?.recording;
    const recordingId =
      typeof rec === "number"
        ? rec
        : rec?.set?.[0]?.id ?? rec?.connect?.[0]?.id;

    console.log("[visitor-download.afterCreate] recordingId:", recordingId);

    if (!recordingId) return;

    const result = await strapi.db.connection.raw(
      "UPDATE recordings SET downloads_count = COALESCE(downloads_count, 0) + 1 WHERE id = ?",
      [recordingId],
    );

    console.log(
      "[visitor-download.afterCreate] updated rows:",
      result?.rowCount ?? "unknown",
    );
  },
};
