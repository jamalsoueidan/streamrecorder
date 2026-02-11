export default {
  routes: [
    {
      method: "POST",
      path: "/clip-shares/me",
      handler: "clip-share.meCreate",
    },
    {
      method: "PUT",
      path: "/clip-shares/me/:id",
      handler: "clip-share.meUpdate",
    },
    {
      method: "DELETE",
      path: "/clip-shares/me/:id",
      handler: "clip-share.meDelete",
    },
  ],
};
