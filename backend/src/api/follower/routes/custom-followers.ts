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
