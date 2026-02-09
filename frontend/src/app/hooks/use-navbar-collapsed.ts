"use client";

import { useState, useCallback } from "react";

const COOKIE_NAME = "navbar-collapsed";

function setCookie(name: string, value: boolean) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${name}=${value};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
}

export function useNavbarCollapsed(initialCollapsed: boolean = false) {
  // Server reads the cookie and passes the correct initial value
  // No need to re-read on client - server is source of truth on load
  const [collapsed, setCollapsedState] = useState(initialCollapsed);

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
