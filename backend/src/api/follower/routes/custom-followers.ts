export default {
  routes: [
    {
      method: "GET",
      path: "/followers/for-user",
      handler: "follower.findForUser",
    },
    {
      method: "POST",
      path: "/followers/follow",
      handler: "follower.follow",
    },
    {
      method: "DELETE",
      path: "/followers/unfollow/:id",
      handler: "follower.unfollow",
    },
  ],
};
