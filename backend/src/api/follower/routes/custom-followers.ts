export default {
  routes: [
    {
      method: "GET",
      path: "/followers/for-user",
      handler: "follower.findForUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
