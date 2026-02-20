"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useEffect } from "react";

const COOKIE_NAME = "_pxvid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export function FingerprintProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function initFingerprint() {
      // Skip if already have fingerprint
      if (getCookie(COOKIE_NAME)) {
        return;
      }

      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setCookie(COOKIE_NAME, result.visitorId, COOKIE_MAX_AGE);
      } catch (error) {
        console.error("Failed to generate fingerprint:", error);
      }
    }

    initFingerprint();
  }, []);

  return <>{children}</>;
}
