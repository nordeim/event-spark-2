export type EventCategory =
  | "Hackathon"
  | "Workshop"
  | "Social"
  | "Conference";

export interface FeaturedEvent {
  readonly id: string;
  readonly title: string;
  readonly dateLabel: string;
  readonly location: string;
  readonly priceLabel: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
  };
}

export interface CategoryCard {
  readonly id: string;
  readonly category: EventCategory;
  readonly image: {
    readonly src: string;
    readonly alt: string;
  };
}

/**
 * Events showcased on the landing page. Values mirror the shipped
 * marketing content; swap the source for a real feed when wiring a backend.
 */
export const featuredEvents: readonly FeaturedEvent[] = [
  {
    id: "ai-hackathon",
    title: "AI hackathon",
    dateLabel: "Sat, Mar 28",
    location: "San Francisco",
    priceLabel: "Free",
    image: {
      src: "/events/event-hackathon-ai.jpg",
      alt: "AI hackathon",
    },
  },
  {
    id: "chill-code-workshop",
    title: "Chill code workshop",
    dateLabel: "Thu, Apr 3",
    location: "London",
    priceLabel: "Free",
    image: {
      src: "/events/event-chill-code-workshop.jpg",
      alt: "Chill code workshop",
    },
  },
  {
    id: "startup-weekend",
    title: "Startup weekend",
    dateLabel: "Fri, Apr 11",
    location: "New York",
    priceLabel: "$25",
    image: {
      src: "/events/event-startup-weekend.jpg",
      alt: "Startup weekend",
    },
  },
  {
    id: "vibe-coding-summit",
    title: "Vibe coding summit",
    dateLabel: "Sat, Apr 19",
    location: "Remote",
    priceLabel: "Free",
    image: {
      src: "/events/event-vibe-coding-summit.jpg",
      alt: "Vibe coding summit",
    },
  },
] as const;

/** Rotating cards floating around the hero headline. */
export const heroCategoryCards: readonly CategoryCard[] = [
  {
    id: "hero-workshop",
    category: "Workshop",
    image: {
      src: "/events/event-chill-code-workshop.jpg",
      alt: "Chill code workshop",
    },
  },
  {
    id: "hero-social",
    category: "Social",
    image: {
      src: "/events/event-late-night-jam.jpg",
      alt: "Late night jam",
    },
  },
  {
    id: "hero-hackathon",
    category: "Hackathon",
    image: {
      src: "/events/event-startup-weekend.jpg",
      alt: "Startup weekend",
    },
  },
  {
    id: "hero-conference",
    category: "Conference",
    image: {
      src: "/events/event-vibe-coding-summit.jpg",
      alt: "Vibe coding summit",
    },
  },
] as const;

/** Headline suffixes cycled in the hero (the pink italic word). */
export const rotatingHeadlineWords: readonly string[] = [
  "connections.",
  "experiences.",
  "events.",
] as const;
