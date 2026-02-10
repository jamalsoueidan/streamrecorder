export default {
  routes: [
    {
      method: "PUT",
      path: "/user/update",
      handler: "user.update",
    },
    {
      method: "DELETE",
      path: "/user/destroy",
      handler: "user.destroy",
    },
  ],
};
