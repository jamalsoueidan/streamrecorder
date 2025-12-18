export default {
  routes: [
    {
      method: "GET",
      path: "/followers/for-user",
      handler: "follower.findForUser",
    },
    {
      method: "GET",
      path: "/followers/not-following",
      handler: "follower.findNotFollowing",
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
