# LiveStreamRecorder Chrome Extension

## Purpose
Let users add their own streamer profiles to LiveStreamRecorder directly from supported platform websites.

## Supported Platforms
- tiktok.com/@username (also /@username/live)
- twitch.tv/username
- kick.com/username
- youtube.com/@username, /channel/id, /c/name
- afreecatv.com/username (also sooplive.co.kr)
- pandalive.co.kr/live/play/username
- bigo.tv/username

## Authentication
- Extension reads the httpOnly `strapi_jwt` cookie via `chrome.cookies` API
- Passes it as `Authorization: Bearer` header to the API
- If not logged in, popup shows "Log in to LiveStreamRecorder" with a link to the login page
- Detects account switches via token hash comparison and invalidates cache

## UX Flow
1. User visits a supported profile page (e.g. tiktok.com/@username)
2. Extension icon badge changes based on state:
   - No badge — not on a supported site
   - "+" blue badge — on a profile, not yet tracked
   - "✓" green badge — already tracked
   - "!" red badge — not logged in
3. User clicks extension icon, popup shows:
   - User role badge (Free, Premium, Champion)
   - Detected profile (username, platform)
   - "Add to LiveStreamRecorder" button (if not tracked)
   - "Already tracking" with stop tracking option (if tracked)
   - Refresh/check now button (non-basic users)
   - Upgrade prompt when max follower limit reached
4. States: loading, no-site, on-site, not-authed, can-add, tracked, success, max-limit, removed

## API Endpoints
- **Add follower**: POST /api/followers/follow `{ username, type }`
- **Remove follower**: POST /api/followers/unfollow `{ username, type }`
- **Check auth**: GET /api/users/me?populate=role
- **Get followers**: GET /api/followers/browse?scope=following

## Caching
- User data and follower list cached in `chrome.storage.local` (persists across service worker restarts)
- 5-minute TTL
- Invalidated on logout (cookie gone) or account switch (token hash change)

## i18n
Translated to 8 languages: en, ar, tr, ko, ja, es, pt, id
Uses `chrome.i18n` with `_locales/` and `data-i18n` attributes in popup.

## File Structure
```
chrome-extension/
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── popup.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── _locales/
    ├── en/messages.json
    ├── ar/messages.json
    ├── tr/messages.json
    ├── ko/messages.json
    ├── ja/messages.json
    ├── es/messages.json
    ├── pt/messages.json
    └── id/messages.json
```

## Development

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked** and select the `chrome-extension/` folder
4. The extension icon appears in the toolbar
5. Log in at https://www.livestreamrecorder.com
6. Visit a supported profile page (e.g. https://www.tiktok.com/@livestreamrecorder)
7. Click the extension icon to test the popup

After making changes to the code:
- **popup.html/js/css**: Close and reopen the popup to see changes
- **background.js**: Click the refresh icon on `chrome://extensions` to reload the service worker
- **manifest.json**: Remove and re-load the extension

To inspect the service worker logs, click "Service Worker" link on `chrome://extensions`.

## Publishing

1. Zip the extension folder (exclude `SPEC.md`)
2. Go to https://chrome.google.com/webstore/devconsole
3. Upload the zip as a new version
4. Submit for review (1-3 business days)

## API Base URL
- Production: https://strapi.livestreamrecorder.com
