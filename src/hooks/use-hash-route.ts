"use client";

import { useCallback, useEffect, useState } from "react";

export type AppRoute =
  | { view: "home" }
  | { view: "auth"; mode: "login" | "signup" }
  | { view: "not-found" };

/**
 * Parses a raw hash string into a typed route. Exported for unit testing;
 * the hook below is its only production consumer.
 */
export function parseHash(hash: string): AppRoute {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const path = raw.split("?")[0] ?? "";
  const query = raw.split("?")[1] ?? "";

  if (path === "" || path === "/") {
    return { view: "home" };
  }

  if (path === "/auth") {
    const mode = query.includes("mode=signup")
      ? "signup"
      : "login";
    return { view: "auth", mode };
  }

  return { view: "not-found" };
}

/**
 * Minimal hash-based router. The product is a single-route App Router page
 * (sandbox exposes only `/`), so views switch client-side via `#/` URLs,
 * which keeps deep links and browser history working.
 */
export function useHashRoute(): {
  route: AppRoute;
  navigate: (to: string) => void;
} {
  const [route, setRoute] = useState<AppRoute>({ view: "home" });

  useEffect(() => {
    const sync = () => setRoute(parseHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const navigate = useCallback((to: string) => {
    const next = to.startsWith("#") ? to : `#${to}`;
    if (window.location.hash === next) {
      setRoute(parseHash(next));
    } else {
      window.location.hash = next;
    }
  }, []);

  return { route, navigate };
}
