export default {
  routes: [
    {
      method: "GET",
      path: "/recordings/browse",
      handler: "recording.browse",
    },
    {
      method: "GET",
      path: "/recordings/storage-stats",
      handler: "recording.storageStats",
    },
  ],
};
