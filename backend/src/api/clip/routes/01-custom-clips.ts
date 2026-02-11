export default {
  routes: [
    {
      method: "GET",
      path: "/clips/me/:id",
      handler: "clip.meFindOne",
    },
    {
      method: "GET",
      path: "/clips/me",
      handler: "clip.meFind",
    },
    {
      method: "GET",
      path: "/clips/random",
      handler: "clip.shuffle",
    },
  ],
};
