import Hls, { FetchLoader } from "hls.js";

/**
 * Swap hls.js's default XHR-based loader for the fetch-based one.
 *
 * The default XhrLoader has a known issue (video-dev/hls.js#1741) where
 * `hls.destroy()` doesn't reliably abort in-flight segment requests —
 * they keep streaming in the background after the player unmounts. This
 * is especially noticeable in scroll feeds where many slides briefly
 * mount/unmount and orphan dozens of MB of segment fetches.
 *
 * `FetchLoader` uses an `AbortController` per request, so when hls.js
 * destroys the loader the controller's `abort()` actually cancels the
 * underlying fetch. Setting it on `DefaultConfig` applies to every
 * `Hls` instance created afterwards (including the ones spun up by
 * `hls-video-element` web component).
 */
let configured = false;

export function configureHls() {
  if (configured) return;
  configured = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Hls.DefaultConfig.fLoader = FetchLoader as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Hls.DefaultConfig.pLoader = FetchLoader as any;

  console.log("[HLS] configured", {
    fLoader: Hls.DefaultConfig.fLoader?.name,
    pLoader: Hls.DefaultConfig.pLoader?.name,
  });
}
