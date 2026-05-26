export default {
  routes: [
    {
      method: "GET",
      path: "/clips/me/:id",
      handler: "clip.meFindOne",
    },
    {
      method: "GET",
      path: "/clips/me",
      handler: "clip.meFind",
    },
    {
      method: "GET",
      path: "/clips/random",
      handler: "clip.shuffle",
    },
    {
      method: "POST",
      path: "/clips/:documentId/view",
      handler: "clip.incrementView",
    },
    {
      method: "POST",
      path: "/clips/:documentId/download",
      handler: "clip.incrementDownload",
    },
    {
      method: "POST",
      path: "/clips/:documentId/report",
      handler: "clip.report",
    },
    {
      method: "POST",
      path: "/clips/:documentId/reset-counters",
      handler: "clip.resetCounters",
    },
  ],
};
