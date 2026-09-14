"use client";

import { ArrowRight } from "lucide-react";
import { featuredEvents } from "@/data/events";
import { EventCard } from "./event-card";
import { ScrollReveal } from "./scroll-reveal";

interface PopularEventsProps {
  onNavigate: (to: string) => void;
}

export function PopularEvents({ onNavigate }: PopularEventsProps) {
  return (
    <section aria-label="Popular events" className="py-20 lg:py-28 bg-muted/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <ScrollReveal className="max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-display text-foreground tracking-[-0.03em] leading-[1.05] mb-3">
              Popular events
              <br />
              on eventspark
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg">
              A glimpse at the experiences our community is hosting right now.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <button
              type="button"
              onClick={() => onNavigate("/auth")}
              className="group inline-flex items-center gap-2 text-primary font-semibold text-sm self-start md:self-end transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full py-1 pr-1"
            >
              Browse all events
              <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </button>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map((event, index) => (
            <ScrollReveal key={event.id} delay={index * 0.08}>
              <EventCard event={event} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
