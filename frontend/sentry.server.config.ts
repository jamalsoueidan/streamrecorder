// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1b9bd2e727a84cf09c443321fd53797a@glitchtip.livestreamrecorder.com/1",

  tracesSampleRate: 1,
  sendDefaultPii: true,
});
