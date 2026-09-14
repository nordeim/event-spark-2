/** Third-party tools shown in the "Integrate with everything" orbit mock. */
export const integrationLogos: readonly {
  readonly name: string;
  readonly src: string;
}[] = [
  { name: "Slack", src: "/integrations/slack.svg" },
  { name: "Zoom", src: "/integrations/zoom.svg" },
  { name: "HubSpot", src: "/integrations/hubspot.svg" },
  { name: "Mailchimp", src: "/integrations/mailchimp.svg" },
  { name: "Calendar", src: "/integrations/google-calendar.svg" },
  { name: "Stripe", src: "/integrations/stripe.svg" },
] as const;

/** Attendee avatars in the "One hub for everyone" card mock. */
export const audienceAvatars: readonly {
  readonly name: string;
  readonly src: string;
}[] = [
  { name: "Attendee 1", src: "/attendees/attendee-1.jpg" },
  { name: "Attendee 2", src: "/attendees/attendee-2.jpg" },
  { name: "Attendee 3", src: "/attendees/attendee-3.jpg" },
  { name: "Attendee 4", src: "/attendees/attendee-4.jpg" },
  { name: "Attendee 5", src: "/attendees/attendee-5.jpg" },
  { name: "Attendee 6", src: "/attendees/attendee-6.jpg" },
] as const;
