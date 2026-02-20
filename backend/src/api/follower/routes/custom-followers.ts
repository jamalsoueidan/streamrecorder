export default {
  routes: [
    {
      method: "GET",
      path: "/followers/filters",
      handler: "follower.filters",
    },
    {
      method: "GET",
      path: "/followers/browse",
      handler: "follower.browse",
    },
    {
      method: "GET",
      path: "/followers/following",
      handler: "follower.following",
    },
    {
      method: "GET",
      path: "/followers/discover",
      handler: "follower.discover",
    },
    {
      method: "POST",
      path: "/followers/follow",
      handler: "follower.follow",
    },
    {
      method: "POST",
      path: "/followers/unfollow",
      handler: "follower.unfollow",
    },
    {
      method: "POST",
      path: "/followers/bulk-update-checked",
      handler: "follower.bulkUpdateLastChecked",
    },
    {
      method: "DELETE",
      path: "/followers/cleanup",
      handler: "follower.cleanup",
    },
    {
      method: "POST",
      path: "/followers/connect-user-with-follower/:userDocumentId",
      handler: "follower.connectUserWithFollower",
    },
  ],
};
