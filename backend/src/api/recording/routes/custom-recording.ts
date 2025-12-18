export default {
  routes: [
    {
      method: "GET",
      path: "/recordings/for-user",
      handler: "recording.findForUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
