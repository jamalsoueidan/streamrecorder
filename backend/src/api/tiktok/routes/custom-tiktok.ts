export default {
  routes: [
    {
      method: "GET",
      path: "/tiktoks/me",
      handler: "tiktok.meFind",
    },
    {
      method: "POST",
      path: "/tiktoks/me",
      handler: "tiktok.meCreate",
    },
    {
      method: "PUT",
      path: "/tiktoks/me/:id",
      handler: "tiktok.meUpdate",
    },
    {
      method: "DELETE",
      path: "/tiktoks/me/:id",
      handler: "tiktok.meDelete",
    },
  ],
};
