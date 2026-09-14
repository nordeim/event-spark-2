"use client";

import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { ScrollReveal } from "./scroll-reveal";

export function Testimonials() {
  return (
    <section
      aria-label="Testimonials"
      className="py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-display mb-4 text-foreground tracking-[-0.02em]">
            Loved by organizers
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.id} delay={index * 0.06}>
              <article className="bg-card text-card-foreground h-full border-0 shadow-sm overflow-hidden rounded-2xl">
                <div className="h-[180px] overflow-hidden">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <div
                    className="flex gap-0.5 mb-4"
                    role="img"
                    aria-label="Rated 5 out of 5 stars"
                  >
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="w-4 h-4 fill-primary text-primary"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-5">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
