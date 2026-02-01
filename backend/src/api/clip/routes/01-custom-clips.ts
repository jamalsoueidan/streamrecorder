export default {
  routes: [
    {
      method: "GET",
      path: "/clips/random",
      handler: "clip.shuffle",
    },
  ],
};
