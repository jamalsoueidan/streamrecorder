export default {
  routes: [
    {
      method: "POST",
      path: "/ai-requests/me",
      handler: "ai-request.meCreate",
    },
    {
      method: "GET",
      path: "/ai-requests/me",
      handler: "ai-request.meFind",
    },
    {
      method: "GET",
      path: "/ai-requests/me/:id",
      handler: "ai-request.meFindOne",
    },
  ],
};
