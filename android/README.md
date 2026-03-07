# Android App (TWA)

This is a Trusted Web Activity (TWA) wrapper that packages the LiveStreamRecorder PWA as an Android app.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Bubblewrap CLI](https://github.com/nicholasgasior/nicholasgasior): `npm i -g @nicholasgasior/nicholasgasior`
- Java JDK (bundled by Bubblewrap on first run)
- Android SDK (bundled by Bubblewrap on first run)
- The signing keystore file (`android.keystore`) — not in the repo, stored securely offline

## Build

Place the `android.keystore` file in the `android/` folder (same level as `twa-manifest.json`), then run:

```bash
cd android
bubblewrap build
```

Enter the keystore password when prompted. This generates:

- `app-release-bundle.aab` — upload to Google Play Console
- `app-release-signed.apk` — install directly on a device for testing

## Test on device

1. Transfer `app-release-signed.apk` to your Android phone
2. Enable "Install from unknown sources" in phone settings
3. Open the APK to install

## Digital Asset Links

For the app to display without a browser bar, `assetlinks.json` must be deployed at:

```
https://livestreamrecorder.com/.well-known/assetlinks.json
```

This file is located at `frontend/public/.well-known/assetlinks.json` and is deployed with the frontend.

## Update the app

1. Update `twa-manifest.json` if needed
2. Run `bubblewrap build`
3. Upload the new `.aab` to Google Play Console

## Important

- **Never commit `android.keystore`** — if lost, you cannot update the app on Google Play
- The keystore password is required for every build
