export default {
  routes: [
    {
      method: "GET",
      path: "/clips/me",
      handler: "clip.me",
    },
    {
      method: "GET",
      path: "/clips/random",
      handler: "clip.shuffle",
    },
  ],
};
