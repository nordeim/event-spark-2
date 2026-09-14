export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  readonly name: string;
  readonly role: string;
  readonly avatar: string;
}

/** Organizer quotes rendered in the testimonials grid. */
export const testimonials: readonly Testimonial[] = [
  {
    id: "sarah-chen",
    quote:
      "eventspark cut our setup time by 80%. We went from spending hours on registration to minutes.",
    name: "Sarah Chen",
    role: "Community manager",
    avatar: "/avatars/avatar-sarah.jpg",
  },
  {
    id: "marcus-williams",
    quote:
      "The analytics alone are worth it. We finally know where our attendees are coming from.",
    name: "Marcus Williams",
    role: "Event coordinator",
    avatar: "/avatars/avatar-marcus.jpg",
  },
  {
    id: "priya-patel",
    quote:
      "Clean, professional, and easy to use. Our attendees always compliment the registration experience.",
    name: "Priya Patel",
    role: "Startup founder",
    avatar: "/avatars/avatar-priya.jpg",
  },
  {
    id: "james-liu",
    quote:
      "We switched from three different tools to just eventspark. Everything in one place is a game changer.",
    name: "James Liu",
    role: "Tech meetup organizer",
    avatar: "/avatars/avatar-james.jpg",
  },
  {
    id: "amara-osei",
    quote:
      "Our registrations doubled after switching. The pages just look so much more professional.",
    name: "Amara Osei",
    role: "Conference director",
    avatar: "/avatars/avatar-amara.jpg",
  },
] as const;
