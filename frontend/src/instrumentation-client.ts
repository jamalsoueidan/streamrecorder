// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1b9bd2e727a84cf09c443321fd53797a@glitchtip.livestreamrecorder.com/1",
  tunnel: "/api/glitchtip-tunnel",
  beforeSend(event) {
    if (
      typeof navigator !== "undefined" &&
      /bot|crawler|spider|googlebot/i.test(navigator.userAgent)
    ) {
      return null;
    }
    const message = event.exception?.values?.[0]?.value || "";
    if (message.includes("play() request was interrupted") ||
        message.includes("play method is not allowed") ||
        message.includes("Minified React error")) {
      return null;
    }
    return event;
  },
  beforeBreadcrumb(breadcrumb) {
    // Skip UI click breadcrumbs on media-chrome/hls-video elements to prevent
    // infinite recursion in Shadow DOM traversal (causes Maximum call stack size exceeded)
    if (
      breadcrumb.category === "ui.click" &&
      (breadcrumb.message?.includes("media-") ||
        breadcrumb.message?.includes("hls-video"))
    ) {
      return null;
    }
    return breadcrumb;
  },

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  sendDefaultPii: true,
});
