export default {
  routes: [
    {
      method: "POST",
      path: "/social-auth/login",
      handler: "social-account.login",
      config: { auth: false },
    },
  ],
};
