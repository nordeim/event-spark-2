"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";

interface NavbarProps {
  onNavigate: (to: string) => void;
}

/**
 * Fixed translucent 72px navbar rail that mirrors the reference behavior:
 * tucked away (translateY(-100px)) on initial load, then revealed by the
 * first user scroll intent (wheel/touch — not programmatic scroll) and
 * kept visible from then on. Remains keyboard-focusable throughout.
 */
export function Navbar({ onNavigate }: NavbarProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reveal = () => setRevealed(true);
    // Reveal on any genuine scroll intent: pointer wheel, touch drag,
    // keyboard paging, or programmatic movement.
    window.addEventListener("wheel", reveal, { passive: true });
    window.addEventListener("touchmove", reveal, { passive: true });
    window.addEventListener("scroll", reveal, { passive: true });
    return () => {
      window.removeEventListener("wheel", reveal);
      window.removeEventListener("touchmove", reveal);
      window.removeEventListener("scroll", reveal);
    };
  }, []);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md",
        "transition-transform duration-300 ease-out",
        revealed ? "translate-y-0" : "-translate-y-[100px]",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="transition-transform duration-300 hover:scale-[1.02] active:scale-95"
          aria-label="eventspark — back to home"
        >
          <Logo />
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/auth")}
            className={cn(
              "inline-flex items-center justify-center rounded-full h-11 px-4 py-2",
              "text-sm font-medium text-foreground transition-colors duration-200",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/auth?mode=signup")}
            className={cn(
              "inline-flex items-center justify-center rounded-full h-11 px-5 py-2",
              "text-sm font-semibold text-background bg-foreground",
              "transition-[transform,colors,box-shadow] duration-200 ease-out",
              "hover:-translate-y-[1px] hover:shadow-float active:scale-[0.97]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}
