export default {
  routes: [
    {
      method: "POST",
      path: "/change-log/github-webhook",
      handler: "change-log.handleGithubWebhook",
      config: { auth: false },
    },
  ],
};
