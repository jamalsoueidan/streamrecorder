// Tiny wrapper around Next.js's standalone server.js. The only reason it
// exists: handle SIGTERM so the old container exits in seconds instead of
// the full Docker stop_grace_period.
//
// Without this, Next.js's server.js doesn't react to SIGTERM at all, so
// Coolify's "stop old container" step waits the full grace timeout
// (~10 minutes in our setup) before SIGKILL — and during that whole
// window Traefik load-balances new+old, hitting users with stale Server
// Action IDs. With this wrapper, old container exits cleanly in <5s.

const SHUTDOWN_TIMEOUT_MS = 5000;

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[start] received ${signal}, exiting in ${SHUTDOWN_TIMEOUT_MS}ms`);

  // Give a short window for in-flight requests to finish, then exit hard.
  // We don't try to gracefully drain — Next.js's standalone server.js
  // doesn't expose its HTTP server instance, so we can't close() it
  // cleanly. The 5s window covers most short requests; long-poll/SSE
  // clients reconnect on the new container after the brief disconnect.
  setTimeout(() => {
    console.log(`[start] timeout reached, exiting`);
    process.exit(0);
  }, SHUTDOWN_TIMEOUT_MS).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

require("./server.js");
