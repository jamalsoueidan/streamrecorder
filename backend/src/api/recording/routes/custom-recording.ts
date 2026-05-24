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
    {
      method: "POST",
      path: "/recordings/:documentId/report",
      handler: "recording.report",
    },
    {
      method: "POST",
      path: "/recordings/:documentId/reset-counters",
      handler: "recording.resetCounters",
    },
  ],
};
