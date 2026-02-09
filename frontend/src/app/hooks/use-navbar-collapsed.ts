"use client";

import { useState, useCallback, useEffect } from "react";

const COOKIE_NAME = "navbar-collapsed";

function getCookie(name: string): boolean | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  if (match) {
    return match[2] === "true";
  }
  return null;
}

function setCookie(name: string, value: boolean) {
  // Set cookie with 1 year expiry
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${name}=${value};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
}

export function useNavbarCollapsed(initialCollapsed: boolean = false) {
  const [collapsed, setCollapsedState] = useState(initialCollapsed);

  // Sync with cookie on mount (in case cookie changed in another tab)
  useEffect(() => {
    const cookieValue = getCookie(COOKIE_NAME);
    if (cookieValue !== null && cookieValue !== collapsed) {
      setCollapsedState(cookieValue);
    }
  }, []);

  const setCollapsed = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setCollapsedState((prev) => {
      const newValue = typeof value === "function" ? value(prev) : value;
      setCookie(COOKIE_NAME, newValue);
      return newValue;
    });
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, [setCollapsed]);

  return { collapsed, setCollapsed, toggle };
}
