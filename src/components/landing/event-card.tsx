"use client";

import type { FeaturedEvent } from "@/data/events";

interface EventCardProps {
  event: FeaturedEvent;
}

/**
 * Featured event tile: 4/5 image with gradient scrim, price badge,
 * pink date eyebrow, title, and location — matching the reference card.
 */
export function EventCard({ event }: EventCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-3xl overflow-hidden mb-4 aspect-[4/5]">
        <img
          src={event.image.src}
          alt={event.image.alt}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 bg-background/95 backdrop-blur text-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.15em] shadow-sm">
          {event.priceLabel}
        </span>
      </div>
      <p className="text-[11px] text-primary font-bold uppercase tracking-[0.18em] mb-1.5">
        {event.dateLabel}
      </p>
      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors tracking-[-0.01em]">
        {event.title}
      </h3>
      <p className="text-sm text-muted-foreground mt-0.5">
        {event.location}
      </p>
    </div>
  );
}
