export default {
  routes: [
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
