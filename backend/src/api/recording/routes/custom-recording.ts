export default {
  routes: [
    {
      method: "GET",
      path: "/recordings/for-user",
      handler: "recording.findForUser",
    },
    {
      method: "GET",
      path: "/recordings/not-following",
      handler: "recording.findNotFollowing",
    },
  ],
};
