export function trackEvent(name: string, data?: Record<string, unknown>) {
  const payload = JSON.stringify({
    type: "event",
    payload: {
      website: process.env.NEXT_PUBLIC_UMAMI_ID,
      name,
      url: window.location.pathname,
      data,
    },
  });
  navigator.sendBeacon("/api/send", payload);
}
