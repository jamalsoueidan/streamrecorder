import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useEffect, useState } from "react";

const COOKIE_NAME = "_pxvid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export function useFingerprint() {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFingerprint() {
      // Check if we already have a fingerprint in cookie
      const existingFp = getCookie(COOKIE_NAME);
      if (existingFp) {
        setVisitorId(existingFp);
        setIsLoading(false);
        return;
      }

      // Generate new fingerprint
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const id = result.visitorId;

        // Store in cookie for server access
        setCookie(COOKIE_NAME, id, COOKIE_MAX_AGE);
        setVisitorId(id);
      } catch (error) {
        console.error("Failed to generate fingerprint:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFingerprint();
  }, []);

  return { visitorId, isLoading };
}
