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

  // FetchLoader uses AbortController, so destroy() actually cancels
  // in-flight fetches. Cast is safe — FetchLoader handles all contexts.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Hls.DefaultConfig.fLoader = FetchLoader as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Hls.DefaultConfig.pLoader = FetchLoader as any;

  // TikTok-style buffer limits. Default is 30s ahead + Infinity behind,
  // which means each scroll-feed slide loads ~30 chunky segments
  // (15–45 MB) before stopping. With these caps, only ~5s of segments
  // are ever in-flight per video — so even if a destroy doesn't abort
  // every request perfectly, the wasted bandwidth is trivial.
  Hls.DefaultConfig.maxBufferLength = 5;
  Hls.DefaultConfig.maxMaxBufferLength = 10;
  Hls.DefaultConfig.backBufferLength = 0;
}
