export default {
  routes: [
    {
      method: "GET",
      path: "/recordings/browse",
      handler: "recording.browse",
    },
    {
      method: "POST",
      path: "/recordings/search",
      handler: "recording.search",
    },
  ],
};
