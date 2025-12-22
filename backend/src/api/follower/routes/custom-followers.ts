export default {
  routes: [
    {
      method: "GET",
      path: "/followers/browse",
      handler: "follower.browse",
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
    {
      method: "POST",
      path: "/followers/import",
      handler: "follower.import",
    },
  ],
};
