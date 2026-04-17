// LiveStreamRecorder Chrome Extension - Popup Logic

// ── i18n helper ────────────────────────────────────────────────────────────
const t = (key) => chrome.i18n.getMessage(key) || key;

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
}

// ── Platform display config ─────────────────────────────────────────────────
const PLATFORM_META = {
  tiktok:    { name: "TikTok",    letter: "T",  prefix: "@" },
  twitch:    { name: "Twitch",    letter: "Tw", prefix: "" },
  kick:      { name: "Kick",      letter: "K",  prefix: "" },
  youtube:   { name: "YouTube",   letter: "Y",  prefix: "@" },
  afreecatv: { name: "AfreecaTV", letter: "A",  prefix: "" },
  pandalive: { name: "PandaLive", letter: "P",  prefix: "" },
  bigo:      { name: "Bigo",      letter: "B",  prefix: "" },
  buzzcast:  { name: "Buzzcast",  letter: "BC", prefix: "" },
  liveme:    { name: "LiveMe",    letter: "LM", prefix: "" },
};

// ── Platform SVG icons ──────────────────────────────────────────────────────
const PLATFORM_SVGS = {
  tiktok: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.4a8.16 8.16 0 004.76 1.52V7.47a4.85 4.85 0 01-1-.78z"/></svg>`,
  twitch: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 2L2 6v14h5v4l4-4h3l5-5V2zm12 11l-3 3h-3l-2.571 2.571V16H6V4h12z"/></svg>`,
  kick: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><text x="4" y="18" font-size="16" font-weight="bold" font-family="Arial">K</text></svg>`,
  youtube: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.7 31.7 0 000 12a31.7 31.7 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.7 31.7 0 0024 12a31.7 31.7 0 00-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>`,
  afreecatv: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><text x="4" y="17" font-size="14" font-weight="bold" font-family="Arial">AF</text></svg>`,
  pandalive: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="10" r="7" fill="none" stroke="#fff" stroke-width="2"/><circle cx="9" cy="9" r="2" fill="#fff"/><circle cx="15" cy="9" r="2" fill="#fff"/><ellipse cx="12" cy="13" rx="3" ry="2" fill="none" stroke="#fff" stroke-width="1.5"/></svg>`,
  bigo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><circle cx="12" cy="12" r="9" fill="none" stroke="#000" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#000"/></svg>`,
  buzzcast: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><text x="2" y="17" font-size="12" font-weight="bold" font-family="Arial">BC</text></svg>`,
  liveme: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M19.5 8.1 3.5 11.8l7.6 2.5 1.2 7.6 7.2-13.8Z"/><path d="m10.4 4 4 .5-1.9 3.7-2.1-4.2Zm9.4 9.5L16.6 20.6 12 16.1l7.8-2.6Z"/></svg>`,
};

// ── DOM refs ────────────────────────────────────────────────────────────────
const states = {
  loading:   document.getElementById("state-loading"),
  noSite:    document.getElementById("state-no-site"),
  onSite:    document.getElementById("state-on-site"),
  notAuthed: document.getElementById("state-not-authed"),
  canAdd:    document.getElementById("state-can-add"),
  tracked:   document.getElementById("state-tracked"),
  success:   document.getElementById("state-success"),
  maxLimit:  document.getElementById("state-max-limit"),
  removed:   document.getElementById("state-removed"),
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function showState(stateKey) {
  Object.entries(states).forEach(([key, el]) => {
    if (key === stateKey) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
}

function formatUsername(username, platform) {
  const meta = PLATFORM_META[platform] || { prefix: "" };
  return `${meta.prefix}${username}`;
}

function setPlatformIcon(element, platform) {
  element.className = `platform-icon-large ${platform}`;
  const svg = PLATFORM_SVGS[platform];
  if (svg) {
    element.innerHTML = svg;
  } else {
    const meta = PLATFORM_META[platform] || { letter: "?" };
    element.textContent = meta.letter;
  }
}

function setSmallPlatformIcon(element, platform) {
  const svg = PLATFORM_SVGS[platform];
  if (svg) {
    element.innerHTML = svg.replace(/width="20"/g, 'width="14"').replace(/height="20"/g, 'height="14"');
  }
}

function restoreAddButton(btn) {
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
    </svg>
    <span>${t("addButton")}</span>
  `;
}

const REFRESH_SVG = '<svg id="refresh-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.65 6.35A7.96 7.96 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/></svg>';
const CHECK_SVG = '<svg id="refresh-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>';

// ── Initialization ──────────────────────────────────────────────────────────

let currentProfile = null;

async function init() {
  applyTranslations();
  showState("loading");

  try {
    const response = await chrome.runtime.sendMessage({ type: "GET_STATE" });

    if (!response) {
      showState("noSite");
      return;
    }

    currentProfile = response.profile;

    // Show role badge if authenticated
    if (response.user && response.user.role) {
      const badge = document.getElementById("role-badge");
      const role = response.user.role;
      badge.textContent = role;
      badge.className = "role-badge";
      if (role.toLowerCase() === "premium") badge.classList.add("role-premium");
      else if (role.toLowerCase() === "champion") badge.classList.add("role-champion");
      else badge.classList.add("role-free");
      badge.classList.remove("hidden");
    }

    switch (response.state) {
      case "no_site":
        showState("noSite");
        break;

      case "on_site":
        showState("onSite");
        break;

      case "not_authed":
        showState("notAuthed");
        if (response.profile) {
          const detectedEl = document.getElementById("detected-profile-unauthed");
          detectedEl.classList.remove("hidden");
          document.getElementById("unauthed-username").textContent =
            formatUsername(response.profile.username, response.profile.platform);
          setSmallPlatformIcon(
            document.getElementById("unauthed-platform-icon"),
            response.profile.platform
          );
        }
        break;

      case "can_add":
        showCanAdd(response.profile);
        break;

      case "tracked":
        showTracked(response.profile, response.user?.role);
        break;

      default:
        showState("noSite");
    }
  } catch (err) {
    console.error("LiveStreamRecorder popup error:", err);
    showState("noSite");
  }
}

function showCanAdd(profile) {
  showState("canAdd");

  const meta = PLATFORM_META[profile.platform] || { name: profile.platform, letter: "?" };

  setPlatformIcon(document.getElementById("add-platform-icon"), profile.platform);
  document.getElementById("add-platform-name").textContent = meta.name;
  document.getElementById("add-username").textContent = formatUsername(profile.username, profile.platform);
}

function showTracked(profile, userRole) {
  showState("tracked");

  const meta = PLATFORM_META[profile.platform] || { name: profile.platform, letter: "?" };

  setPlatformIcon(document.getElementById("tracked-platform-icon"), profile.platform);
  document.getElementById("tracked-platform-name").textContent = meta.name;
  document.getElementById("tracked-username").textContent = formatUsername(profile.username, profile.platform);

  // Show refresh button for non-basic users
  const role = (userRole || "").toLowerCase();
  if (role && role !== "basic" && role !== "free" && role !== "authenticated") {
    document.getElementById("btn-refresh").classList.remove("hidden");
  }
}

// ── Event handlers ──────────────────────────────────────────────────────────

// Login button
document.getElementById("btn-login").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://livestreamrecorder.com/login" });
  window.close();
});

// Upgrade button
document.getElementById("btn-upgrade").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://livestreamrecorder.com/premium" });
  window.close();
});

// Refresh button (re-adds to trigger live check)
document.getElementById("btn-refresh").addEventListener("click", async () => {
  if (!currentProfile) return;

  const btn = document.getElementById("btn-refresh");
  const icon = document.getElementById("refresh-icon");
  const label = document.getElementById("refresh-label");

  btn.disabled = true;
  icon.outerHTML = '<div class="btn-spinner" id="refresh-icon"></div>';
  label.textContent = t("checkingNow");

  try {
    const response = await chrome.runtime.sendMessage({
      type: "FOLLOW",
      username: currentProfile.username,
      platform: currentProfile.platform,
    });

    const newIcon = document.getElementById("refresh-icon");
    if (response && response.ok) {
      newIcon.outerHTML = CHECK_SVG;
      label.textContent = t("done");
      setTimeout(() => {
        label.textContent = t("checkNow");
        document.getElementById("refresh-icon").outerHTML = REFRESH_SVG;
        btn.disabled = false;
      }, 2000);
    } else {
      newIcon.outerHTML = REFRESH_SVG;
      label.textContent = t("checkNow");
      btn.disabled = false;
    }
  } catch {
    label.textContent = t("checkNow");
    btn.disabled = false;
  }
});

// Add button
document.getElementById("btn-add").addEventListener("click", async () => {
  if (!currentProfile) return;

  const btn = document.getElementById("btn-add");
  const errorEl = document.getElementById("add-error");

  btn.disabled = true;
  btn.textContent = t("adding");
  errorEl.classList.add("hidden");

  try {
    const response = await chrome.runtime.sendMessage({
      type: "FOLLOW",
      username: currentProfile.username,
      platform: currentProfile.platform,
    });

    if (response && response.ok) {
      showState("success");
      const meta = PLATFORM_META[currentProfile.platform] || { name: currentProfile.platform };
      document.getElementById("success-detail").textContent =
        `${formatUsername(currentProfile.username, currentProfile.platform)} on ${meta.name}`;
    } else {
      const error = response?.error || "";
      const isMaxLimit = error.includes("MAX_3_FOLLOWERS") || error.includes("MAX_50_FOLLOWERS") || error.includes("MAX_100_FOLLOWERS");

      if (isMaxLimit) {
        showState("maxLimit");
      } else {
        errorEl.textContent = error || t("addError");
        errorEl.classList.remove("hidden");
        btn.disabled = false;
        restoreAddButton(btn);
      }
    }
  } catch (err) {
    errorEl.textContent = t("connectionError");
    errorEl.classList.remove("hidden");
    btn.disabled = false;
    restoreAddButton(btn);
  }
});

// Remove button
document.getElementById("btn-remove").addEventListener("click", async () => {
  if (!currentProfile) return;

  const btn = document.getElementById("btn-remove");
  const errorEl = document.getElementById("remove-error");

  btn.disabled = true;
  btn.textContent = t("removing");
  errorEl.classList.add("hidden");

  try {
    const response = await chrome.runtime.sendMessage({
      type: "UNFOLLOW",
      username: currentProfile.username,
      platform: currentProfile.platform,
    });

    if (response && response.ok) {
      showState("removed");
    } else {
      errorEl.textContent = response?.error || t("addError");
      errorEl.classList.remove("hidden");
      btn.disabled = false;
      btn.textContent = t("stopTracking");
    }
  } catch (err) {
    errorEl.textContent = t("connectionError");
    errorEl.classList.remove("hidden");
    btn.disabled = false;
    btn.textContent = t("stopTracking");
  }
});

// ── Start ───────────────────────────────────────────────────────────────────
init();
