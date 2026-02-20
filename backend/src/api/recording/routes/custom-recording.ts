export default {
  routes: [
    {
      method: "GET",
      path: "/recordings/browse",
      handler: "recording.browse",
    },
    {
      method: "GET",
      path: "/recordings/following",
      handler: "recording.following",
    },
    {
      method: "GET",
      path: "/recordings/explore",
      handler: "recording.explore",
    },
    {
      method: "GET",
      path: "/recordings/storage-stats",
      handler: "recording.storageStats",
    },
  ],
};
