"use client";

import { cn } from "@/lib/utils";

interface NotFoundViewProps {
  onNavigate: (to: string) => void;
}

/** Mirrors the reference app's 404 screen: centered content, no navbar. */
export function NotFoundView({ onNavigate }: NotFoundViewProps) {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-10 sm:py-12 relative overflow-hidden">
      <div className="text-center relative z-10">
        <h1 className="font-display font-bold text-7xl sm:text-8xl text-foreground tracking-[-0.035em] leading-[0.95] mb-6">
          404
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
          Oops! Page not found
        </p>
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full",
            "text-sm font-semibold text-background bg-foreground hover:bg-foreground/90",
            "px-6 h-11",
            "transition-[transform,colors,box-shadow] duration-200 ease-out",
            "hover:-translate-y-[1px] hover:shadow-float active:scale-[0.97]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          Return to Home
        </button>
      </div>
    </main>
  );
}
