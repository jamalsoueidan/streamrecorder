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
    {
      method: "PUT",
      path: "/user/push-subscription",
      handler: "user.setPushSubscription",
    },
    {
      method: "DELETE",
      path: "/user/push-subscription",
      handler: "user.deletePushSubscription",
    },
    {
      method: "POST",
      path: "/user/test-push",
      handler: "user.testPushNotification",
    },
    {
      method: "POST",
      path: "/user/notify-streamers-live",
      handler: "user.notifyStreamersLive",
    },
  ],
};
