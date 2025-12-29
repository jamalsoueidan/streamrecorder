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
  ],
};
