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
      path: "/followers/search",
      handler: "follower.search",
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
      path: "/followers/favorite",
      handler: "follower.favorite",
    },
    {
      method: "POST",
      path: "/followers/unfavorite",
      handler: "follower.unfavorite",
    },
    {
      method: "POST",
      path: "/followers/bulk-update-checked",
      handler: "follower.bulkUpdateLastChecked",
    },
    {
      method: "POST",
      path: "/followers/unpause-my-followers",
      handler: "follower.unpauseMyFollowers",
    },
    {
      method: "POST",
      path: "/followers/connect-user-with-follower/:userDocumentId",
      handler: "follower.connectUserWithFollower",
    },
  ],
};
