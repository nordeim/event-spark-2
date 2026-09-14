"use client";

import {
  EventPageMock,
  IntegrationsOrbitMock,
  LiveChartMock,
  AudienceGridMock,
} from "./feature-mocks";
import { ScrollReveal } from "./scroll-reveal";

interface FeatureCardShellProps {
  cardClassName: string;
  mockClassName: string;
  mock: React.ReactNode;
  badge: string;
  badgeClassName: string;
  title: string;
  description: string;
  descriptionClassName: string;
}

function FeatureCardShell({
  cardClassName,
  mockClassName,
  mock,
  badge,
  badgeClassName,
  title,
  description,
  descriptionClassName,
}: FeatureCardShellProps) {
  return (
    <div
      className={`h-full rounded-[2rem] overflow-hidden flex flex-col shadow-sm ${cardClassName}`}
    >
      <div
        className={`aspect-[5/3] flex items-center justify-center relative flex-shrink-0 ${mockClassName}`}
      >
        {mock}
      </div>
      <div className="p-7 lg:p-8 flex flex-col justify-center">
        <span
          className={`inline-block self-start text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full mb-4 ${badgeClassName}`}
        >
          {badge}
        </span>
        <h3 className="font-display font-bold text-2xl mb-2 tracking-[-0.02em]">
          {title}
        </h3>
        <p className={`text-sm leading-relaxed ${descriptionClassName}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/4 right-0 w-[420px] h-[420px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
        <ScrollReveal className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-4">
            Built for organizers
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-5 text-foreground tracking-[-0.035em] leading-[1.02]">
            Everything you need to
            <br />
            run amazing events.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From page creation to post-event analytics, eventspark has you
            covered.
          </p>
        </ScrollReveal>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ScrollReveal>
              <FeatureCardShell
                cardClassName="bg-foreground text-background"
                mockClassName="bg-[hsl(340,75%,95%)]"
                mock={<EventPageMock />}
                badge="Pages"
                badgeClassName="bg-background/10 text-background/80"
                title="Pages in minutes"
                description="Beautiful registration pages that make your event shine — no design skills needed."
                descriptionClassName="text-background/65"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <FeatureCardShell
                cardClassName="bg-primary/10 text-foreground"
                mockClassName="bg-[hsl(170,60%,92%)]"
                mock={<LiveChartMock />}
                badge="Insights"
                badgeClassName="bg-primary/15 text-primary"
                title="Understand everything"
                description="Live dashboards that show where attendees come from, drop off, and convert."
                descriptionClassName="text-foreground/65"
              />
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <ScrollReveal className="md:col-span-2">
              <FeatureCardShell
                cardClassName="bg-muted text-foreground"
                mockClassName="bg-[hsl(45,90%,92%)]"
                mock={<IntegrationsOrbitMock />}
                badge="Integrations"
                badgeClassName="bg-background text-foreground/70"
                title="Integrate with everything"
                description="Connect Zoom, HubSpot, Mailchimp, and 20+ tools in a few clicks."
                descriptionClassName="text-muted-foreground"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.08} className="md:col-span-3">
              <div className="h-full rounded-[2rem] overflow-hidden flex flex-col sm:flex-row shadow-sm bg-primary text-primary-foreground">
                <div className="bg-[hsl(250,60%,94%)] sm:w-1/2 aspect-[5/3] sm:aspect-auto flex items-center justify-center relative flex-shrink-0">
                  <AudienceGridMock />
                </div>
                <div className="p-7 lg:p-8 flex flex-col justify-center">
                  <span className="inline-block self-start text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full mb-4 bg-primary-foreground/15 text-primary-foreground">
                    Audience
                  </span>
                  <h3 className="font-display font-bold text-2xl mb-2 tracking-[-0.02em]">
                    One hub for everyone
                  </h3>
                  <p className="text-sm leading-relaxed text-primary-foreground/80">
                    Manage, message, and track every attendee from a single
                    beautiful dashboard.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
