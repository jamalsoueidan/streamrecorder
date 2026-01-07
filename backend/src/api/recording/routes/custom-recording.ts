export default {
  routes: [
    {
      method: "GET",
      path: "/recordings/browse",
      handler: "recording.browse",
    },
    {
      method: "GET",
      path: "/recordings/count",
      handler: "recording.count",
    },
  ],
};
