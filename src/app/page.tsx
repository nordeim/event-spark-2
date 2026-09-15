"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { useHashRoute } from "@/hooks/use-hash-route";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { PopularEvents } from "@/components/landing/popular-events";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { AuthView } from "@/components/auth/auth-view";
import { NotFoundView } from "@/components/shared/not-found-view";

function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <PopularEvents />
        <Features />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Application shell. The product ships as a single App Router route with
 * hash-based view switching (`#/`, `#/auth`, anything else → 404), which
 * keeps deep links and history semantics intact without extra server
 * routes. User-facing CTAs are `#/…` anchors; the `onNavigate` callback
 * remains for programmatic navigation (e.g. the post-auth redirect).
 * `MotionConfig reducedMotion="user"` honors `prefers-reduced-motion`
 * across all framer-motion choreography.
 *
 * `AuthView` is keyed by `route.mode`: a hashchange that flips the mode
 * (`#/auth` ↔ `#/auth?mode=signup`, e.g. via back/forward) remounts the
 * view so the active tab always matches the URL — the URL stays the
 * source of truth. Tab clicks inside the view change local state only.
 */
export default function Page() {
  const { route, navigate } = useHashRoute();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [route.view]);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        {route.view === "home" && <LandingPage />}
        {route.view === "auth" && (
          <AuthView
            key={route.mode}
            initialMode={route.mode}
            onNavigate={navigate}
          />
        )}
        {route.view === "not-found" && <NotFoundView />}
      </SmoothScroll>
    </MotionConfig>
  );
}
