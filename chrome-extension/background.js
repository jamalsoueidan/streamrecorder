// LiveStreamRecorder Chrome Extension - Background Service Worker
// Listens to tab URL changes, parses URLs for platform/username,
// checks auth + follow status, and updates the badge accordingly.

const API_BASE = "https://strapi.livestreamrecorder.com";
const COOKIE_URL = "https://livestreamrecorder.com";
const COOKIE_NAME = "strapi_jwt";

// ── Ignored path segments per platform ──────────────────────────────────────
// These are common routes that are NOT user profiles.
const IGNORED_PATHS = new Set([
  "settings",
  "search",
  "explore",
  "about",
  "login",
  "register",
  "signup",
  "signin",
  "help",
  "privacy",
  "terms",
  "tos",
  "directory",
  "downloads",
  "notifications",
  "messages",
  "subscriptions",
  "inventory",
  "wallet",
  "friends",
  "following",
  "followers",
  "feed",
  "trending",
  "live",
  "clips",
  "videos",
  "upload",
  "premium",
  "gaming",
  "music",
  "watch",
  "results",
  "hashtag",
  "playlist",
  "channel",
  "c",
  "user",
  "account",
  "checkout",
  "redeem",
  "store",
  "turbo",
  "jobs",
  "press",
  "blog",
  "brand",
  "legal",
  "p",
  "features",
  "categories",
]);

// ── URL parsing ─────────────────────────────────────────────────────────────
// Returns { platform, username } or null if not a supported profile URL.
// Use isSupportedSite() to check if on a supported domain without a profile match.
function isSupportedSite(urlString) {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    return false;
  }
  const hostname = url.hostname.replace(/^www\./, "");
  const supported = [
    "tiktok.com", "twitch.tv", "kick.com", "youtube.com",
    "afreecatv.com", "sooplive.co.kr", "pandalive.co.kr", "bigo.tv",
    "buzzcast.com", "tango.me", "liveme.com",
  ];
  return supported.some((d) => hostname === d || hostname.endsWith("." + d));
}

function parseProfileUrl(urlString) {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, "");
  const path = url.pathname;

  // TikTok: tiktok.com/@username or tiktok.com/@username/live
  if (hostname === "tiktok.com" || hostname.endsWith(".tiktok.com")) {
    const match = path.match(/^\/@([A-Za-z0-9_.]+)/);
    if (match) return { platform: "tiktok", username: match[1] };
    return null;
  }

  // Twitch: twitch.tv/username
  if (hostname === "twitch.tv" || hostname.endsWith(".twitch.tv")) {
    const match = path.match(/^\/([A-Za-z0-9_]+)\/?$/);
    if (match && !IGNORED_PATHS.has(match[1].toLowerCase())) {
      return { platform: "twitch", username: match[1] };
    }
    return null;
  }

  // Kick: kick.com/username
  if (hostname === "kick.com" || hostname.endsWith(".kick.com")) {
    const match = path.match(/^\/([A-Za-z0-9_-]+)\/?$/);
    if (match && !IGNORED_PATHS.has(match[1].toLowerCase())) {
      return { platform: "kick", username: match[1] };
    }
    return null;
  }

  // YouTube: youtube.com/@username, /channel/id, /c/name
  if (hostname === "youtube.com" || hostname.endsWith(".youtube.com")) {
    const handleMatch = path.match(/^\/@([A-Za-z0-9_.-]+)/);
    if (handleMatch) return { platform: "youtube", username: handleMatch[1] };
    const channelMatch = path.match(/^\/channel\/([A-Za-z0-9_-]+)/);
    if (channelMatch) return { platform: "youtube", username: channelMatch[1] };
    const customMatch = path.match(/^\/c\/([A-Za-z0-9_-]+)/);
    if (customMatch) return { platform: "youtube", username: customMatch[1] };
    return null;
  }

  // AfreecaTV / SOOP: afreecatv.com/username, play.afreecatv.com, bj.afreecatv.com, sooplive.co.kr
  if (
    hostname === "afreecatv.com" || hostname.endsWith(".afreecatv.com") ||
    hostname === "sooplive.co.kr" || hostname.endsWith(".sooplive.co.kr")
  ) {
    const stationMatch = path.match(/^\/station\/([A-Za-z0-9_]+)/);
    if (stationMatch) return { platform: "afreecatv", username: stationMatch[1] };
    const match = path.match(/^\/([A-Za-z0-9_]+)\/?$/);
    if (match && !IGNORED_PATHS.has(match[1].toLowerCase())) {
      return { platform: "afreecatv", username: match[1] };
    }
    return null;
  }

  // PandaLive: pandalive.co.kr/live/play/username
  if (
    hostname === "pandalive.co.kr" ||
    hostname.endsWith(".pandalive.co.kr")
  ) {
    const match = path.match(/^\/live\/play\/([A-Za-z0-9_]+)/);
    if (match) return { platform: "pandalive", username: match[1] };
    return null;
  }

  // Bigo: bigo.tv/username
  if (hostname === "bigo.tv" || hostname.endsWith(".bigo.tv")) {
    const match = path.match(/^\/([A-Za-z0-9_]+)\/?$/);
    if (match && !IGNORED_PATHS.has(match[1].toLowerCase())) {
      return { platform: "bigo", username: match[1] };
    }
    return null;
  }

  // Buzzcast: buzzcast.com/web/personalInfo/username
  if (hostname === "buzzcast.com" || hostname.endsWith(".buzzcast.com")) {
    const match = path.match(/^\/web\/personalInfo\/([A-Za-z0-9_]+)/);
    if (match) return { platform: "buzzcast", username: match[1] };
    return null;
  }

  // Tango: tango.me/username
  if (hostname === "tango.me" || hostname.endsWith(".tango.me")) {
    const match = path.match(/^\/([A-Za-z0-9_.-]+)\/?$/);
    if (match && !IGNORED_PATHS.has(match[1].toLowerCase())) {
      return { platform: "tango", username: match[1] };
    }
    return null;
  }

  // LiveMe: liveme.com/u/userId
  if (hostname === "liveme.com" || hostname.endsWith(".liveme.com")) {
    const match = path.match(/^\/(?:[a-z]{2}\/)?u\/([A-Za-z0-9_]+)/);
    if (match) return { platform: "liveme", username: match[1] };
    return null;
  }

  return null;
}

// ── JWT Token ───────────────────────────────────────────────────────────────
// Read the httpOnly strapi_jwt cookie using chrome.cookies API

async function getToken() {
  // Try multiple possible URLs since the cookie domain may vary
  const urls = [
    "https://livestreamrecorder.com",
    "https://www.livestreamrecorder.com",
  ];
  for (const url of urls) {
    const cookie = await chrome.cookies.get({ url, name: COOKIE_NAME });
    if (cookie) return cookie.value;
  }
  return null;
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ── Cache (persisted to chrome.storage.local to survive SW restarts) ────────
let cachedUser = null;
let cachedFollowers = [];
let cacheTimestamp = 0;
let cachedTokenHash = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cacheLoaded = false;

async function loadCache() {
  if (cacheLoaded) return;
  const data = await chrome.storage.local.get(["cachedUser", "cachedFollowers", "cacheTimestamp", "cachedTokenHash"]);
  cachedUser = data.cachedUser || null;
  cachedFollowers = data.cachedFollowers || [];
  cacheTimestamp = data.cacheTimestamp || 0;
  cachedTokenHash = data.cachedTokenHash || null;
  cacheLoaded = true;
}

function saveCache() {
  chrome.storage.local.set({ cachedUser, cachedFollowers, cacheTimestamp, cachedTokenHash });
}

// Simple hash to detect token changes (different user)
function hashToken(token) {
  if (!token) return null;
  // Use first 20 + last 20 chars as a fingerprint
  return token.length > 40 ? token.slice(0, 20) + token.slice(-20) : token;
}

async function checkTokenChanged() {
  const token = await getToken();
  const currentHash = hashToken(token);
  if (cachedTokenHash && currentHash !== cachedTokenHash) {
    invalidateCache();
    return true;
  }
  return false;
}

function isCacheStale() {
  return Date.now() - cacheTimestamp > CACHE_TTL;
}

function invalidateCache() {
  cachedUser = null;
  cachedFollowers = [];
  cacheTimestamp = 0;
  cacheLoaded = true;
  saveCache();
}

// ── API helpers ─────────────────────────────────────────────────────────────

async function fetchAuth() {
  try {
    const token = await getToken();
    if (!token) return null;
    const res = await fetch(`${API_BASE}/api/users/me?populate=role`, {
      headers: authHeaders(token),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchFollowers() {
  try {
    const token = await getToken();
    if (!token) { console.log("[LSR] fetchFollowers: no token"); return []; }
    const params = new URLSearchParams({
      "scope": "following",
      "fields[0]": "username",
      "fields[1]": "type",
      "pagination[pageSize]": "600",
    });
    const url = `${API_BASE}/api/followers/browse?${params}`;
    console.log("[LSR] fetchFollowers URL:", url);
    const res = await fetch(url, {
      headers: authHeaders(token),
    });
    console.log("[LSR] fetchFollowers status:", res.status);
    if (!res.ok) { console.log("[LSR] fetchFollowers not ok"); return []; }
    const json = await res.json();
    console.log("[LSR] fetchFollowers data count:", json.data?.length, "sample:", json.data?.[0]);
    if (json.data && Array.isArray(json.data)) {
      return json.data.map((item) => ({
        username: (item.username || "").toLowerCase(),
        type: (item.type || "").toLowerCase(),
      }));
    }
    return [];
  } catch (e) {
    console.error("[LSR] fetchFollowers error:", e);
    return [];
  }
}

async function refreshCache() {
  const token = await getToken();
  const user = await fetchAuth();
  if (!user || !user.id) {
    invalidateCache();
    return false;
  }
  cachedUser = user;
  cachedFollowers = await fetchFollowers();
  cacheTimestamp = Date.now();
  cachedTokenHash = hashToken(token);
  saveCache();
  return true;
}

function isFollowing(username, platform) {
  const u = username.toLowerCase();
  const p = platform.toLowerCase();
  const found = cachedFollowers.some((f) => f.username === u && f.type === p);
  console.log(`[LSR] isFollowing("${u}", "${p}") = ${found}, cache size: ${cachedFollowers.length}`);
  return found;
}

// ── Badge management ────────────────────────────────────────────────────────

const BADGE = {
  clear: { text: "", color: "#000000" },
  notAuth: { text: "!", color: "#E53935" }, // red
  canAdd: { text: "+", color: "#1E88E5" }, // blue
  tracked: { text: "\u2713", color: "#43A047" }, // green checkmark
};

async function setBadge(tabId, state) {
  const { text, color } = BADGE[state] || BADGE.clear;
  try {
    await chrome.action.setBadgeText({ text, tabId });
    await chrome.action.setBadgeBackgroundColor({ color, tabId });
  } catch {
    // Tab may have been closed
  }
}

// ── Main logic: evaluate a tab and update its badge ─────────────────────────

async function evaluateTab(tabId, url) {
  await loadCache();
  if (!url) {
    await setBadge(tabId, "clear");
    return;
  }

  const profile = parseProfileUrl(url);
  if (!profile) {
    await setBadge(tabId, "clear");
    return;
  }

  // Quick cookie check before using cache
  const token = await getToken();
  if (!token) {
    invalidateCache();
    await setBadge(tabId, "notAuth");
    return;
  }

  // Detect user switch (different JWT = different account)
  await checkTokenChanged();

  // We're on a supported profile page. Check auth + follow status.
  if (isCacheStale() || !cachedUser) {
    const authed = await refreshCache();
    if (!authed) {
      await setBadge(tabId, "notAuth");
      return;
    }
  }

  if (isFollowing(profile.username, profile.platform)) {
    await setBadge(tabId, "tracked");
  } else {
    await setBadge(tabId, "canAdd");
  }
}

// ── Event listeners ─────────────────────────────────────────────────────────

// When a tab's URL changes (navigation, SPA pushState, etc.)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === "complete") {
    const url = changeInfo.url || tab.url;
    evaluateTab(tabId, url);
  }
});

// When user switches to a different tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    evaluateTab(activeInfo.tabId, tab.url);
  } catch {
    // Tab may not exist
  }
});

// When the extension starts or is reloaded, check the active tab
chrome.runtime.onStartup.addListener(async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tab) evaluateTab(tab.id, tab.url);
});

chrome.runtime.onInstalled.addListener(async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tab) evaluateTab(tab.id, tab.url);
});

// ── Message handling (from popup) ───────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_STATE") {
    handleGetState().then(sendResponse);
    return true;
  }

  if (message.type === "FOLLOW") {
    handleFollow(message).then(sendResponse);
    return true;
  }

  if (message.type === "UNFOLLOW") {
    handleUnfollow(message).then(sendResponse);
    return true;
  }

  if (message.type === "INVALIDATE_CACHE") {
    invalidateCache();
    sendResponse({ ok: true });
    return false;
  }
});

async function handleGetState() {
  await loadCache();
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (!tab || !tab.url) {
    return { state: "no_site", profile: null, user: null };
  }

  const profile = parseProfileUrl(tab.url);
  if (!profile) {
    if (isSupportedSite(tab.url)) {
      return { state: "on_site", profile: null, user: null };
    }
    return { state: "no_site", profile: null, user: null };
  }

  // Always check if cookie still exists (instant, no API call)
  const token = await getToken();
  if (!token) {
    invalidateCache();
    return { state: "not_authed", profile, user: null };
  }

  // Detect user switch (different JWT = different account)
  await checkTokenChanged();

  if (isCacheStale() || !cachedUser) {
    await refreshCache();
  }

  if (!cachedUser) {
    return { state: "not_authed", profile, user: null };
  }

  const tracked = isFollowing(profile.username, profile.platform);
  return {
    state: tracked ? "tracked" : "can_add",
    profile,
    user: { id: cachedUser.id, username: cachedUser.username, role: cachedUser.role?.name || "Free" },
  };
}

async function handleFollow({ username, platform }) {
  try {
    const token = await getToken();
    if (!token) return { ok: false, error: "Not authenticated" };

    const res = await fetch(`${API_BASE}/api/followers/follow`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ username, type: platform }),
    });
    if (!res.ok) {
      let errorCode = "";
      try {
        const json = await res.json();
        errorCode = json?.error?.message || "";
      } catch {
        errorCode = await res.text();
      }
      return { ok: false, error: errorCode, status: res.status };
    }

    // Update cache immediately
    cachedFollowers.push({
      username: username.toLowerCase(),
      type: platform.toLowerCase(),
    });
    saveCache();

    // Update badge on active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab) await setBadge(tab.id, "tracked");

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function handleUnfollow({ username, platform }) {
  try {
    const token = await getToken();
    if (!token) return { ok: false, error: "Not authenticated" };

    const res = await fetch(`${API_BASE}/api/followers/unfollow`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ username, type: platform }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }

    // Update cache immediately
    cachedFollowers = cachedFollowers.filter(
      (f) =>
        !(
          f.username === username.toLowerCase() &&
          f.type === platform.toLowerCase()
        )
    );
    saveCache();

    // Update badge on active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab) await setBadge(tab.id, "canAdd");

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
