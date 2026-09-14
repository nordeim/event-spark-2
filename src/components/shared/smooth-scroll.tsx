"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis-powered inertial scrolling, matching the reference site's feel.
 * Disabled entirely for users who prefer reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      wheelMultiplier: 1,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
