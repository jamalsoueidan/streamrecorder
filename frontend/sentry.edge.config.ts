// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1b9bd2e727a84cf09c443321fd53797a@glitchtip.livestreamrecorder.com/1",

  tracesSampleRate: 1,
  sendDefaultPii: true,
});
