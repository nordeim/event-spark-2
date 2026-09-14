"use client";

import { useEffect } from "react";
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

function LandingPage({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar onNavigate={onNavigate} />
      <main>
        <Hero onNavigate={onNavigate} />
        <PopularEvents onNavigate={onNavigate} />
        <Features />
        <Testimonials />
        <FinalCta onNavigate={onNavigate} />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Application shell. The product ships as a single App Router route with
 * hash-based view switching (`#/`, `#/auth`, anything else → 404), which
 * keeps deep links and history semantics intact without extra server routes.
 */
export default function Page() {
  const { route, navigate } = useHashRoute();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [route.view]);

  return (
    <SmoothScroll>
      {route.view === "home" && <LandingPage onNavigate={navigate} />}
      {route.view === "auth" && (
        <AuthView initialMode={route.mode} onNavigate={navigate} />
      )}
      {route.view === "not-found" && <NotFoundView onNavigate={navigate} />}
    </SmoothScroll>
  );
}
